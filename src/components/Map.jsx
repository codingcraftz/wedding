"use client";

import React, { useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import { Copy, Loader } from "lucide-react";
import { HALL_NAME, HALL_ADDRESS, HALL_LAT, HALL_LNG } from "@/lib/constants";

export default function NavigationAndAddress() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingApp, setLoadingApp] = useState({ naver: false, kakao: false, tmap: false });

  // 네비게이션 앱 실행 URL
  const kakaoNaviUrl = `kakaomap://look?p=${HALL_LAT},${HALL_LNG}`;
  const naverNaviUrl = `nmap://navigation?dlat=${HALL_LAT}&dlng=${HALL_LNG}&dname=${encodeURIComponent(
    HALL_NAME
  )}&appname=wedding-app`;
  const tMapNaviUrl = `tmap://route?goalname=${HALL_NAME}&goalx=${HALL_LNG}&goaly=${HALL_LAT}`;

  // 웹 URL (앱이 없을 경우 사용)
  const kakaoWebUrl = `https://map.kakao.com/link/map/${encodeURIComponent(
    HALL_NAME
  )},${HALL_LAT},${HALL_LNG}`;
  const naverWebUrl = `https://map.naver.com/v5/search/${encodeURIComponent(HALL_ADDRESS)}`;
  const tMapWebUrl = `https://apis.openapi.sk.com/tmap/app/routes?endX=${HALL_LNG}&endY=${HALL_LAT}&endName=${encodeURIComponent(
    HALL_NAME
  )}`;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(HALL_ADDRESS);
      toast.success("주소가 복사되었습니다!", {
        style: { background: "#333", color: "#fff" },
      });
    } catch {
      toast.error("주소 복사에 실패했습니다.");
    }
  };

  // 앱 실행 함수
  const handleAppNavigation = (type, appUrl, webUrl) => {
    // 로딩 상태 설정
    setLoadingApp({ ...loadingApp, [type]: true });

    // 현재 시간 기록
    const startTime = new Date().getTime();

    // 앱 URL 열기 시도
    window.location.href = appUrl;

    // 앱 설치 여부 확인을 위한 타이머
    const timer = setTimeout(() => {
      // 3초 이상 걸렸다면 앱이 설치되지 않은 것으로 간주
      const endTime = new Date().getTime();
      if (endTime - startTime > 2000) {
        // 앱이 열리지 않았으면 웹 버전으로 이동
        window.location.href = webUrl;
        toast.error(
          `${
            type === "naver" ? "네이버 지도" : type === "kakao" ? "카카오맵" : "티맵"
          } 앱이 설치되어 있지 않습니다.`,
          {
            style: { background: "#333", color: "#fff" },
          }
        );
      }
      setLoadingApp({ ...loadingApp, [type]: false });
    }, 2500);

    // 페이지 이탈 시 타이머 정리
    window.addEventListener(
      "pagehide",
      () => {
        clearTimeout(timer);
        setLoadingApp({ ...loadingApp, [type]: false });
      },
      { once: true }
    );
  };

  return (
    <div className="bg-white px-6 flex flex-col items-center text-center text-black w-full">
      <Toaster position="top-center" />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`}
        strategy="beforeInteractive"
        onLoad={() => setMapLoaded(true)}
      />
      <div className="text-center">
        <p className="uppercase text-xs text-gray-400 tracking-widest py-4">LOCATION</p>
        <h2 className="text-base">
          <p className="font-semibold">오시는 길</p>
          <div className="text-sm text-gray-700 leading-relaxed mt-6">
            <p>서울 광진구 능동로 110</p>
            <p>스타시티영존 5층 스타시티아트홀</p>
          </div>
        </h2>
      </div>

      <div className="w-full mt-6 rounded-xl overflow-hidden shadow-lg border">
        <Map
          center={{ lat: HALL_LAT, lng: HALL_LNG }}
          style={{ width: "100%", height: "300px" }}
          level={3}
        >
          <MapMarker position={{ lat: HALL_LAT, lng: HALL_LNG }}></MapMarker>
          <CustomOverlayMap position={{ lat: HALL_LAT, lng: HALL_LNG }} yAnchor={1}>
            <div className="bg-white px-3 py-2 border-2 border-[#ee7685] rounded-lg shadow-md relative">
              <span className="text-sm font-medium flex justify-center items-center text-[#ee7685]">
                {HALL_NAME}
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#ee7685] rotate-45"></div>
            </div>
          </CustomOverlayMap>
        </Map>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 w-full">
        <button
          onClick={() => handleAppNavigation("naver", naverNaviUrl, naverWebUrl)}
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50 relative"
        >
          {loadingApp.naver ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
              <Loader className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          ) : null}
          <img src="/maps/naver_map.png" alt="네이버 지도" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">네이버 지도</span>
        </button>
        <button
          onClick={() => handleAppNavigation("kakao", kakaoNaviUrl, kakaoWebUrl)}
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50 relative"
        >
          {loadingApp.kakao ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
              <Loader className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          ) : null}
          <img src="/maps/kakao_map.png" alt="카카오 내비" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">카카오 내비</span>
        </button>
        <button
          onClick={() => handleAppNavigation("tmap", tMapNaviUrl, tMapWebUrl)}
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50 relative"
        >
          {loadingApp.tmap ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
              <Loader className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          ) : null}
          <img src="/maps/tmap.png" alt="티맵" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">티맵</span>
        </button>
      </div>

      <button
        onClick={copyAddress}
        className="mt-4 inline-flex items-center gap-1 text-sm text-gray-600 px-4 py-2 border rounded-full hover:bg-gray-50"
      >
        <Copy size={14} /> 주소 복사하기
      </button>

      <div className="w-full mt-10 text-left text-sm border-t pt-6 space-y-6">
        <div className="bg-[#fff9f9] p-4 rounded-lg border-l-4 border-[#ee7685]">
          <h3 className="font-bold mb-1">버스 대절 안내</h3>
          <p className="text-gray-600">
            용흥공영주차장(포항시 북구 용흥동 산24-3)에서 2025년 5월 31일(토) 오전 7:30 출발
          </p>
          <p className="text-gray-500 text-xs mt-1">
            ※ 버스는 예약되어 있으니 시간에 맞춰 도착해주세요. 정시에 출발합니다.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-1">버스 이용시</h3>
          <p className="text-gray-600">건대입구역, 건대입구 사거리 하차</p>
          <p className="text-gray-600">
            240, 721, N61, N62 / 2016, 2222, 3217, 3220, 4212 / 102, 3500 / 6013
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-1">지하철 이용시</h3>
          <div>
            <p className="text-gray-600">2호선 건대입구역 2번 출구</p>
            <p className="text-gray-600">7호선 건대입구역 3번 출구 앞 건물</p>
          </div>
        </div>
      </div>
    </div>
  );
}
