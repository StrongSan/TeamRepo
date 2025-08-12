package com.cakeday

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.kakao.sdk.auth.AuthApiClient
import com.kakao.sdk.auth.model.OAuthToken
import com.kakao.sdk.common.model.ClientError
import com.kakao.sdk.common.model.ClientErrorCause
import com.kakao.sdk.user.UserApiClient
import com.kakao.sdk.auth.TokenManagerProvider
import kotlinx.coroutines.*

class KakaoLoginModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KakaoLoginModule"
    }

    @ReactMethod
    fun login(promise: Promise) {
        try {
            val activity = currentActivity ?: run {
                promise.reject("NO_ACTIVITY", "Activity is null")
                return
            }

            // 메인 스레드에서 실행
            activity.runOnUiThread {
                try {
                    // 카카오톡 설치 여부 확인
                    if (UserApiClient.instance.isKakaoTalkLoginAvailable(activity)) {
                        // 카카오톡 로그인
                        UserApiClient.instance.loginWithKakaoTalk(activity) { token, error ->
                            try {
                                when {
                                    error != null -> {
                                        if (error is ClientError && error.reason == ClientErrorCause.Cancelled) {
                                            promise.reject("CANCELLED", "User cancelled login")
                                        } else {
                                            promise.reject("LOGIN_ERROR", error.message ?: "Unknown error")
                                        }
                                    }
                                    token != null -> {
                                        // 성공
                                        val result = Arguments.createMap().apply {
                                            putString("accessToken", token.accessToken)
                                            putString("refreshToken", token.refreshToken)
                                            putDouble("expiresAt", token.accessTokenExpiresAt?.time?.toDouble() ?: 0.0)
                                            putDouble("refreshTokenExpiresAt", token.refreshTokenExpiresAt?.time?.toDouble() ?: 0.0)
                                            putArray("scopes", createWritableArray(token.scopes))
                                        }
                                        promise.resolve(result)
                                    }
                                    else -> {
                                        promise.reject("UNKNOWN_ERROR", "Unknown error occurred")
                                    }
                                }
                            } catch (e: Exception) {
                                promise.reject("LOGIN_ERROR", "Exception during login: ${e.message}")
                            }
                        }
                    } else {
                        // 카카오톡 미설치 - 웹 로그인
                        UserApiClient.instance.loginWithKakaoAccount(activity) { token, error ->
                            try {
                                when {
                                    error != null -> {
                                        if (error is ClientError && error.reason == ClientErrorCause.Cancelled) {
                                            promise.reject("CANCELLED", "User cancelled login")
                                        } else {
                                            promise.reject("LOGIN_ERROR", error.message ?: "Unknown error")
                                        }
                                    }
                                    token != null -> {
                                        // 성공
                                        val result = Arguments.createMap().apply {
                                            putString("accessToken", token.accessToken)
                                            putString("refreshToken", token.refreshToken)
                                            putDouble("expiresAt", token.accessTokenExpiresAt?.time?.toDouble() ?: 0.0)
                                            putDouble("refreshTokenExpiresAt", token.refreshTokenExpiresAt?.time?.toDouble() ?: 0.0)
                                            putArray("scopes", createWritableArray(token.scopes))
                                        }
                                        promise.resolve(result)
                                    }
                                    else -> {
                                        promise.reject("UNKNOWN_ERROR", "Unknown error occurred")
                                    }
                                }
                            } catch (e: Exception) {
                                promise.reject("LOGIN_ERROR", "Exception during login: ${e.message}")
                            }
                        }
                    }
                } catch (e: Exception) {
                    promise.reject("LOGIN_ERROR", "Exception in login method: ${e.message}")
                }
            }
        } catch (e: Exception) {
            promise.reject("LOGIN_ERROR", "Exception in login: ${e.message}")
        }
    }

    // ArrayList를 WritableArray로 변환하는 헬퍼 메서드
    private fun createWritableArray(scopes: List<String>?): WritableArray {
        val array = Arguments.createArray()
        scopes?.forEach { scope ->
            array.pushString(scope)
        }
        return array
    }

    @ReactMethod
    fun logout(promise: Promise) {
        try {
            UserApiClient.instance.logout { error ->
                if (error != null) {
                    promise.reject("LOGOUT_ERROR", error.message ?: "Unknown error")
                } else {
                    promise.resolve("Logout successful")
                }
            }
        } catch (e: Exception) {
            promise.reject("LOGOUT_ERROR", "Exception during logout: ${e.message}")
        }
    }

    @ReactMethod
    fun getAccessToken(promise: Promise) {
        try {
            // 현재 로그인된 사용자 정보를 통해 토큰 상태 확인
            UserApiClient.instance.me { user, error ->
                if (error != null) {
                    promise.reject("TOKEN_ERROR", error.message ?: "Unknown error")
                } else {
                    // 사용자가 로그인되어 있다면 토큰이 유효함
                    val result = Arguments.createMap().apply {
                        putString("accessToken", "valid_token") // 실제 토큰은 SDK 내부에서 관리
                        putDouble("expiresAt", (System.currentTimeMillis() + 3600000).toDouble()) // 1시간 후
                    }
                    promise.resolve(result)
                }
            }
        } catch (e: Exception) {
            promise.reject("TOKEN_ERROR", "Exception during getAccessToken: ${e.message}")
        }
    }

    @ReactMethod
    fun getProfile(promise: Promise) {
        try {
            Log.d("KakaoLoginModule", "getProfile 시작")
            
            UserApiClient.instance.me { user, error ->
                if (error != null) {
                    Log.e("KakaoLoginModule", "getProfile error: ${error.message}")
                    promise.reject("PROFILE_ERROR", error.message ?: "Unknown error")
                } else {
                    Log.d("KakaoLoginModule", "getProfile user: $user")
                    Log.d("KakaoLoginModule", "getProfile user.id: ${user?.id}")
                    Log.d("KakaoLoginModule", "getProfile user.id type: ${user?.id?.javaClass}")
                    
                    val userId = user?.id?.toString() ?: ""
                    Log.d("KakaoLoginModule", "getProfile userId: $userId")
                    
                    val result = Arguments.createMap().apply {
                        putString("id", userId)
                        putString("nickname", user?.kakaoAccount?.profile?.nickname ?: "")
                        putString("email", user?.kakaoAccount?.email ?: "")
                        putString("profileImage", user?.kakaoAccount?.profile?.profileImageUrl ?: "")
                        putString("thumbnailImage", user?.kakaoAccount?.profile?.thumbnailImageUrl ?: "")
                    }
                    
                    Log.d("KakaoLoginModule", "getProfile result: $result")
                    promise.resolve(result)
                }
            }
        } catch (e: Exception) {
            Log.e("KakaoLoginModule", "getProfile exception: ${e.message}")
            promise.reject("PROFILE_ERROR", "Exception during getProfile: ${e.message}")
        }
    }

    @ReactMethod
    fun isLoggedIn(promise: Promise) {
        try {
            UserApiClient.instance.me { user, error ->
                if (error != null) {
                    promise.resolve(false)
                } else {
                    promise.resolve(user != null)
                }
            }
        } catch (e: Exception) {
            promise.reject("LOGIN_STATUS_ERROR", "Exception during isLoggedIn: ${e.message}")
        }
    }

    // 이벤트 발송 메서드
    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            // 이벤트 발송 실패는 무시
        }
    }
} 