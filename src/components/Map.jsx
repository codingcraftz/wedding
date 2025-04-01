"use client";

import React, { useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import { HALL_LAT, HALL_LNG, HALL_NAME, HALL_ADDRESS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Gamja_Flower } from "next/font/google";
import { Bus, Train, Car, Copy, Map as MapIcon, MapPin, ExternalLink } from "lucide-react";

// 감자꽃 폰트는 특별한 강조를 위해 유지
const gamjaFlower = Gamja_Flower({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function NavigationAndAddress() {
  const [activeTab, setActiveTab] = useState("navi");
  const [mapLoaded, setMapLoaded] = useState(false);

  // 네비게이션 URL (수정됨)
  const kakaoNaviUrl = `kakaomap://look?p=${HALL_LAT},${HALL_LNG}`;
  const naverNaviUrl = `nmap://navigation?dlat=${HALL_LAT}&dlng=${HALL_LNG}&dname=${encodeURIComponent(
    HALL_NAME
  )}&appname=wedding-app`;
  const tMapNaviUrl = `tmap://route?goalname=${HALL_NAME}&goalx=${HALL_LNG}&goaly=${HALL_LAT}`;

  // Kakao 지도 SDK 로드 콜백
  const onKakaoMapScriptLoad = () => {
    setMapLoaded(true);
  };

  // 주소 복사 기능
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(HALL_ADDRESS);
      toast.success("주소가 복사되었습니다!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (err) {
      console.error("주소 복사 실패:", err);
      toast.error("주소 복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white py-18 px-4">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
        onLoad={onKakaoMapScriptLoad}
      />

      {/* "오시는 길" 섹션 */}
      <div
        className={`border-2 border-[#ee7685] text-[#ee7685] font-bold px-6 py-2 mb-8 rounded-full text-xl mb-6 ${gamjaFlower.className}`}
      >
        오시는 길
      </div>

      {/* 카카오 지도 */}
      <div className="w-full h-80 bg-white relative mb-6 rounded-xl overflow-hidden shadow-md">
        <Map
          center={{ lat: HALL_LAT, lng: HALL_LNG }}
          style={{ width: "100%", height: "100%" }}
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

      {/* 주소 표시 */}
      <div className="flex flex-col gap-2 py-2 items-center w-full mb-4 text-center mt-12">
        <p className="text-[#ee7685] font-semibold text-xl">{HALL_NAME}</p>
        <p className="text-gray-700">{HALL_ADDRESS}</p>
        <button
          onClick={copyAddress}
          className="flex items-center gap-1 mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm"
        >
          <Copy size={14} /> 주소 복사하기
        </button>
      </div>

      {/* 버스 대절 정보 (중요한 정보이므로 탭 밖으로 이동) */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-[#ee7685]/10 p-4 rounded-lg border-l-4 border-[#ee7685] shadow-sm">
          <h3 className="text-[#ee7685] font-semibold text-lg mb-2 flex items-center gap-1">
            <Bus size={18} /> 한동고속관광버스 안내
          </h3>
          <div className="flex flex-col gap-1 text-gray-700">
            <p className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-semibold mr-2 text-[#ee7685]">출발지:</span>
              <span>용흥공영주차장(포항시 북구 용흥동 산24-3)</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-semibold mr-2 text-[#ee7685]">출발시간:</span>
              <span className="font-medium">2025년 5월 31일(토) 오전 7:30 출발</span>
            </p>
          </div>
          <p className="mt-2 text-sm bg-white p-2 rounded border border-[#ee7685]/20">
            <span className="font-bold text-[#ee7685]">※ 참고사항:</span> 버스는 예약되어 있으니
            시간에 맞춰 도착해주세요. 정시에 출발합니다.
          </p>
        </div>
      </div>

      {/* 탭 내비게이션 */}
      <Tabs defaultValue="navi" className="w-full max-w-md" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="navi" className="flex items-center gap-1">
            <Car size={16} /> 내비게이션
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-1">
            <Train size={16} /> 대중교통
          </TabsTrigger>
        </TabsList>

        {/* 내비게이션 컨텐츠 */}
        <TabsContent value="navi">
          <Card className="border-[#ee7685]/20">
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => window.open(kakaoNaviUrl, "_blank")}
                  className="flex flex-col items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 p-4 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                    <MapIcon size={24} />
                  </div>
                  <span>카카오맵</span>
                </button>
                <button
                  onClick={() => window.open(naverNaviUrl, "_blank")}
                  className="flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 p-4 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <MapIcon size={24} />
                  </div>
                  <span>네이버맵</span>
                </button>
                <button
                  onClick={() => window.open(tMapNaviUrl, "_blank")}
                  className="flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <MapIcon size={24} />
                  </div>
                  <span>티맵</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 대중교통 정보 */}
        <TabsContent value="public">
          <Card className="border-[#ee7685]/20">
            <CardContent className="pt-2">
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-1">
                    <Train size={18} /> 지하철
                  </h3>
                  <p className="text-gray-700">
                    2호선 건대입구역 2번 출구와 7호선 건대입구역 3번 출구 앞 건물
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-green-600 font-bold text-lg mb-2 flex items-center gap-1">
                    <Bus size={18} /> 버스
                  </h3>
                  <p className="text-gray-700 mb-2">건대입구역, 건대입구역 사거리 하차</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded text-xs">
                        간선
                      </span>
                      <p className="mt-1">240번, 721번, N61번, N62번</p>
                    </div>
                    <div>
                      <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                        지선
                      </span>
                      <p className="mt-1">2016번, 2222번, 3217번, 3220번, 4212번</p>
                    </div>
                    <div>
                      <span className="inline-block bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                        직행
                      </span>
                      <p className="mt-1">102번, 3500번</p>
                    </div>
                    <div>
                      <span className="inline-block bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">
                        공항
                      </span>
                      <p className="mt-1">6013번</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
