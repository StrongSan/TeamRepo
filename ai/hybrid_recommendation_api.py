import os
import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.decomposition import TruncatedSVD
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector
from mysql.connector import Error

app = FastAPI()

# 경로 설정
csv_path = "cakes.csv"
pickle_path = "cake_vectors.pkl"

# MySQL 연결 설정
DB_CONFIG = {
    'host': 'localhost',
    'database': 'cakeday_db',
    'user': 'root',
    'password': 'rlarkdtks94302.'
}


# 데이터베이스 연결 함수
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"데이터베이스 연결 오류: {e}")
        return None


# CSV에서 벡터 생성 및 피클 저장 (콘텐츠 필터링용)
def load_content_data():
    if os.path.exists(pickle_path):
        with open(pickle_path, "rb") as f:
            df, mlb, tag_vectors, cosine_sim_matrix = pickle.load(f)
    else:
        df = pd.read_csv(csv_path)
        df["tags"] = df[["sheet", "filling", "size", "type"]].values.tolist()
        mlb = MultiLabelBinarizer()
        tag_vectors = mlb.fit_transform(df["tags"])
        cosine_sim_matrix = cosine_similarity(tag_vectors)
        with open(pickle_path, "wb") as f:
            pickle.dump((df, mlb, tag_vectors, cosine_sim_matrix), f)

    return df, mlb, tag_vectors, cosine_sim_matrix


# 기존 테이블들에서 직접 사용자 상호작용 데이터 로딩
def load_user_interactions():
    try:
        connection = get_db_connection()
        if not connection:
            return pd.DataFrame()

        # 기존 테이블들에서 직접 데이터 수집
        query = """
        -- 조회 데이터 (viewed_cake_log)
        SELECT DISTINCT 
            vcl.user_id,
            c.variant_id,
            1.0 as weight
        FROM viewed_cake_log vcl
        JOIN cake c ON vcl.cake_id = c.cake_id
        WHERE c.variant_id IS NOT NULL

        UNION ALL

        -- 찜 데이터 (favorite)
        SELECT DISTINCT
            f.user_id,
            c.variant_id,
            3.0 as weight
        FROM favorite f
        JOIN cake c ON f.cake_id = c.cake_id
        WHERE c.variant_id IS NOT NULL

        UNION ALL

        -- 구매 데이터 (order_detail)
        SELECT DISTINCT
            o.user_id,
            od.variant_id,
            5.0 as weight
        FROM order_detail od
        JOIN `order` o ON od.order_id = o.order_id
        WHERE o.user_id IS NOT NULL
        """

        # 데이터 로딩 및 집계
        raw_interactions = pd.read_sql(query, connection)
        connection.close()

        # 사용자별, variant별로 가중치 합계 계산
        interactions_df = raw_interactions.groupby(['user_id', 'variant_id'])['weight'].sum().reset_index()
        interactions_df.columns = ['user_id', 'variant_id', 'total_weight']

        return interactions_df
    except Exception as e:
        print(f"사용자 상호작용 데이터 로딩 오류: {e}")
        return pd.DataFrame()


# 협업 필터링 매트릭스 생성
def create_collaborative_matrix(interactions_df):
    if interactions_df.empty:
        return None, None, None, None

    # User-Item 매트릭스 생성
    user_item_matrix = interactions_df.pivot_table(
        index='user_id',
        columns='variant_id',
        values='total_weight',
        fill_value=0
    )

    if user_item_matrix.shape[1] < 2:
        return None, None, None, None

    # SVD로 차원 축소
    n_components = min(50, user_item_matrix.shape[1] - 1, user_item_matrix.shape[0] - 1)
    if n_components < 1:
        return None, None, None, None

    svd = TruncatedSVD(n_components=n_components, random_state=42)
    user_factors = svd.fit_transform(user_item_matrix)
    item_factors = svd.components_.T

    return user_factors, item_factors, user_item_matrix, svd


# 전역 변수로 데이터 로딩
df, mlb, tag_vectors, cosine_sim_matrix = load_content_data()
interactions_df = load_user_interactions()
collaborative_data = create_collaborative_matrix(interactions_df)


# 요청 모델들
class RecommendRequest(BaseModel):
    variant_ids: List[int]
    user_id: Optional[int] = None


class VariantRequest(BaseModel):
    variant_ids: List[int]


class VariantIdRequest(BaseModel):
    variant_ids: List[int]


class CakePost(BaseModel):
    postId: int
    sellerId: int
    title: str
    description: str
    imageUrl: str
    price: str
    variantId: int


# 콘텐츠 기반 추천
def get_content_based_recommendations(variant_ids, top_k=25):
    if not variant_ids:
        return []

    selected_indices = [
        df[df["variant_id"] == vid].index[0]
        for vid in variant_ids
        if vid in df["variant_id"].values
    ]

    if not selected_indices:
        return []

    avg_sim = cosine_sim_matrix[selected_indices].mean(axis=0)
    sim_scores = list(enumerate(avg_sim))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    recommended_indices = [i for i, score in sim_scores][:top_k]
    return [int(x) for x in df.iloc[recommended_indices]["variant_id"].tolist()]  # numpy.int64 -> int 변환


# 협업 필터링 추천
def get_collaborative_recommendations(user_id, top_k=25):
    if collaborative_data[0] is None or user_id is None:
        return []

    user_factors, item_factors, user_item_matrix, svd = collaborative_data

    if user_id not in user_item_matrix.index:
        return []

    user_idx = list(user_item_matrix.index).index(user_id)
    user_vector = user_factors[user_idx]

    # 모든 아이템에 대한 예측 점수 계산
    item_scores = np.dot(user_vector, item_factors.T)

    # 이미 상호작용한 아이템 제외
    interacted_items = user_item_matrix.loc[user_id]
    item_scores[interacted_items > 0] = -np.inf

    # 상위 추천 아이템 선택
    top_indices = np.argsort(item_scores)[::-1][:top_k]
    recommended_variant_ids = [int(user_item_matrix.columns[i]) for i in top_indices if
                               item_scores[i] > -np.inf]  # numpy.int64 -> int 변환

    return recommended_variant_ids


# 하이브리드 추천 API (기존 /hybrid-recommend 제거)

# 하이브리드 추천 설정
CONTENT_WEIGHT = 0.7  # 콘텐츠 필터링 가중치
COLLABORATIVE_WEIGHT = 0.3  # 협업 필터링 가중치


# 통합 추천 API (하이브리드)
@app.post("/recommend")
async def recommend_cakes(request: RecommendRequest):
    print(f"[FastAPI] 추천 요청 수신 - variant_ids: {request.variant_ids}, user_id: {request.user_id}")
    print(f"[FastAPI] 가중치 설정 - 콘텐츠: {CONTENT_WEIGHT}, 협업: {COLLABORATIVE_WEIGHT}")

    content_recs = get_content_based_recommendations(request.variant_ids, 50)
    collaborative_recs = get_collaborative_recommendations(request.user_id, 50) if request.user_id else []
    
    print(f"[FastAPI] 콘텐츠 기반 추천 결과: {content_recs[:10]}")
    print(f"[FastAPI] 협업 필터링 추천 결과: {collaborative_recs[:10]}")

    # 가중치 적용한 하이브리드 스코어링
    final_scores = {}

    # 콘텐츠 기반 점수
    for i, variant_id in enumerate(content_recs):
        score = (50 - i) / 50  # 순위 기반 정규화
        final_scores[variant_id] = final_scores.get(variant_id, 0) + score * CONTENT_WEIGHT

    # 협업 필터링 점수 (user_id가 있고 데이터가 있을 때만)
    for i, variant_id in enumerate(collaborative_recs):
        score = (50 - i) / 50
        final_scores[variant_id] = final_scores.get(variant_id, 0) + score * COLLABORATIVE_WEIGHT

    # 최종 추천 리스트 생성
    sorted_recs = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
    recommended_variant_ids = [int(vid) for vid, score in sorted_recs[:25]]  # numpy.int64 -> int 변환
    
    print(f"[FastAPI] 최종 추천 결과 (상위 10개): {recommended_variant_ids[:10]}")
    print(f"[FastAPI] 최종 스코어 (상위 5개): {sorted_recs[:5]}")

    # 최소 15개 보장
    if len(recommended_variant_ids) < 15:
        already_used = set(request.variant_ids + recommended_variant_ids)
        remaining_df = df[~df["variant_id"].isin(already_used)]

        extra_needed = 15 - len(recommended_variant_ids)
        if not remaining_df.empty:
            extra = remaining_df.sample(n=min(extra_needed, len(remaining_df)))
            recommended_variant_ids += [int(x) for x in extra["variant_id"].tolist()]  # numpy.int64 -> int 변환

    return {"recommended_cakes": recommended_variant_ids}


# 데이터 새로고침 API (기존 테이블에서 실시간 로딩)
@app.post("/refresh-data")
async def refresh_recommendation_data():
    try:
        global interactions_df, collaborative_data
        interactions_df = load_user_interactions()
        collaborative_data = create_collaborative_matrix(interactions_df)

        user_count = len(interactions_df['user_id'].unique()) if not interactions_df.empty else 0
        interaction_count = len(interactions_df) if not interactions_df.empty else 0

        return {
            "status": "success",
            "message": f"추천 데이터가 새로고침되었습니다. 사용자: {user_count}명, 상호작용: {interaction_count}개"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# 기존 게시글 조회 API (DB에서 직접 조회)
@app.post("/posts/by-variants", response_model=List[CakePost])
async def get_posts_by_variants(request: VariantIdRequest):
    variant_ids = request.variant_ids
    if not variant_ids:
        return []

    try:
        connection = get_db_connection()
        if not connection:
            return []

        # variant_ids를 문자열로 변환하여 SQL IN 절에 사용
        variant_ids_str = ','.join(map(str, variant_ids))

        query = f"""
        SELECT 
            c.cake_id,
            c.seller_id,
            c.cake_name,
            c.description,
            c.cake_img,
            c.price,
            c.variant_id
        FROM cake c
        WHERE c.variant_id IN ({variant_ids_str})
        ORDER BY FIELD(c.variant_id, {variant_ids_str})
        """

        cake_df = pd.read_sql(query, connection)
        connection.close()

        result = []
        base_url = "http://172.30.176.1:8080/images/"  # 백엔드 서버 URL
        
        for _, row in cake_df.iterrows():
            image_filename = str(row["cake_img"]) if pd.notnull(row["cake_img"]) else ""
            full_image_url = f"{base_url}{image_filename}" if image_filename else ""
            
            result.append({
                "postId": int(row["cake_id"]) if pd.notnull(row["cake_id"]) else 0,
                "sellerId": int(row["seller_id"]) if pd.notnull(row["seller_id"]) else 0,
                "title": str(row["cake_name"]) if pd.notnull(row["cake_name"]) else "",
                "description": str(row["description"]) if pd.notnull(row["description"]) else "",
                "imageUrl": full_image_url,
                "price": str(row["price"]) if pd.notnull(row["price"]) else "0",
                "variantId": int(row["variant_id"]) if pd.notnull(row["variant_id"]) else 0
            })

        return result

    except Exception as e:
        print(f"게시글 조회 오류: {e}")
        return []


# 사용자의 최근 조회 기록에서 variant_ids 가져오기
@app.get("/user/{user_id}/recent-variants")
async def get_user_recent_variants(user_id: int):
    try:
        print(f"🔍 사용자 {user_id}의 조회 기록 조회 시작")
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # 사용자의 최근 조회 기록에서 variant_id 가져오기 (최근 10개)
        # 먼저 viewed_cake_log에서 cake_id들을 가져온 후, 각 cake_id에 해당하는 variant_id를 찾기
        query = """
        SELECT c.variant_id 
        FROM viewed_cake_log vcl
        JOIN cake c ON vcl.cake_id = c.cake_id
        WHERE vcl.user_id = %s
        ORDER BY vcl.id DESC
        LIMIT 10
        """
        
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        
        print(f"🔍 쿼리 결과 개수: {len(results)}")
        print(f"🔍 쿼리 결과: {results}")
        
        variant_ids = [row[0] for row in results]
        print(f"🔍 사용자 {user_id}의 조회 기록 variant_ids: {variant_ids}")
        
        # 조회 기록이 없으면 최근 조회한 케이크 정보도 확인
        if not variant_ids:
            debug_query = """
            SELECT vcl.cake_id, vcl.id, c.cake_name
            FROM viewed_cake_log vcl
            JOIN cake c ON vcl.cake_id = c.cake_id
            WHERE vcl.user_id = %s
            ORDER BY vcl.id DESC
            LIMIT 5
            """
            cursor.execute(debug_query, (user_id,))
            debug_results = cursor.fetchall()
            print(f"🔍 디버그 - 조회 기록: {debug_results}")
            
            # cake 테이블에서 variant_id 확인
            if debug_results:
                cake_ids = [row[0] for row in debug_results]
                cake_ids_str = ','.join(map(str, cake_ids))
                variant_query = f"""
                SELECT cake_id, variant_id FROM cake 
                WHERE cake_id IN ({cake_ids_str})
                """
                cursor.execute(variant_query)
                variant_results = cursor.fetchall()
                print(f"🔍 디버그 - 케이크 variant_id: {variant_results}")
        
        cursor.close()
        connection.close()
        
        return variant_ids
        
    except Exception as e:
        print(f"사용자 조회 기록 가져오기 오류: {e}")
        return []


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)