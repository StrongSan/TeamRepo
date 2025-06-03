import os
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# 경로 설정
csv_path = "cakes.csv"
pickle_path = "cake_vectors.pkl"

# CSV에서 벡터 생성 및 피클 저장
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

# ✅ 추천 요청 모델
class VariantRequest(BaseModel):
    variant_ids: List[int]

# ✅ 게시글 상세 조회 요청 모델
class VariantIdRequest(BaseModel):
    variant_ids: List[int]

# ✅ 게시글 응답 모델
class CakePost(BaseModel):
    postId: int
    sellerId: int
    title: str
    description: str
    imageUrl: str
    price: str
    variantId: int

# ✅ 추천 API (최소 15개, 최대 25개)
@app.post("/recommend")
async def recommend_cakes(request: VariantRequest):
    print("🔥 [FastAPI] 추천 요청 수신 - variant_ids:", request.variant_ids)
    selected_ids = request.variant_ids
    if not selected_ids:
        return {"recommended_cakes": []}

    # 선택된 variant_id의 인덱스 찾기
    selected_indices = [
        df[df["variant_id"] == vid].index[0]
        for vid in selected_ids
        if vid in df["variant_id"].values
    ]
    if not selected_indices:
        return {"recommended_cakes": []}

    # 평균 벡터 유사도 계산
    avg_sim = cosine_sim_matrix[selected_indices].mean(axis=0)
    sim_scores = list(enumerate(avg_sim))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # 중복 제외 추천 리스트 구성
    recommended_indices = [i for i, score in sim_scores][:25]


    recommended_variant_ids = df.iloc[recommended_indices]["variant_id"].tolist()

    # ✅ 최소 15개 보장: 부족하면 랜덤으로 보완
    if len(recommended_variant_ids) < 15:
        already_used = set(selected_ids + recommended_variant_ids)
        remaining_df = df[~df["variant_id"].isin(already_used)]

        extra_needed = 15 - len(recommended_variant_ids)
        if not remaining_df.empty:
            extra = remaining_df.sample(n=min(extra_needed, len(remaining_df)))
            recommended_variant_ids += extra["variant_id"].tolist()

    return {"recommended_cakes": recommended_variant_ids}

# ✅ variant_id 기반 게시글 정보 반환 API
@app.post("/posts/by-variants", response_model=List[CakePost])
async def get_posts_by_variants(request: VariantIdRequest):
    variant_ids = request.variant_ids
    if not variant_ids:
        return []

    matched_df = df[df["variant_id"].isin(variant_ids)].copy()

    # 순서 보장
    matched_df["variant_order"] = matched_df["variant_id"].apply(
        lambda x: variant_ids.index(x) if x in variant_ids else -1
    )
    matched_df = matched_df.sort_values("variant_order")

    result = []
    for _, row in matched_df.iterrows():
        result.append({
            "postId": int(row["cake_id"]),
            "sellerId": int(row["seller_id"]),
            "title": row["cake_name"],
            "description": row["description"],
            "imageUrl": row["cake_img"],
            "price": row["price"],
            "variantId": int(row["variant_id"]) if pd.notnull(row["variant_id"]) else 0
        })

    return result
