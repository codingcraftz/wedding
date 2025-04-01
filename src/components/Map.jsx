"use client";

import React, { useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import { Copy } from "lucide-react";
import { HALL_NAME, HALL_ADDRESS, HALL_LAT, HALL_LNG } from "@/lib/constants";

export default function NavigationAndAddress() {
  const [mapLoaded, setMapLoaded] = useState(false);

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
        <a
          href={`https://map.naver.com/v5/search/${encodeURIComponent(HALL_ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50"
        >
          <img src="/maps/naver_map.png" alt="네이버 지도" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">네이버 지도</span>
        </a>
        <a
          href={`https://map.kakao.com/link/map/${encodeURIComponent(
            HALL_NAME
          )},${HALL_LAT},${HALL_LNG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50"
        >
          <img src="/maps/kakao_map.png" alt="카카오 내비" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">카카오 내비</span>
        </a>
        <a
          href={`https://apis.openapi.sk.com/tmap/app/routes?endX=${HALL_LNG}&endY=${HALL_LAT}&endName=${encodeURIComponent(
            HALL_NAME
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center border p-3 rounded-xl hover:bg-gray-50"
        >
          <img src="/maps/tmap.png" alt="티맵" className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">티맵</span>
        </a>
      </div>

      {/* <button
        onClick={copyAddress}
        className="mt-4 inline-flex items-center gap-1 text-sm text-gray-600 px-4 py-2 border rounded-full hover:bg-gray-50"
      >
        <Copy size={14} /> 주소 복사하기
      </button> */}

      <div className="w-full mt-10 text-left text-sm border-t pt-6 space-y-6">
        <div>
          <h3 className="font-bold mb-1">버스 이용시</h3>
          <p className="text-gray-600">건대입구역, 건대입구 사거리 하차</p>
          <p className="text-gray-600">
            240, 721, N61, N62 / 2016, 2222, 3217, 3220, 4212 / 102, 3500 / 6013
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-1">지하철 이용시</h3>
          <p className="text-gray-600">
            2호선 건대입구역 2번 출구 / 7호선 건대입구역 3번 출구 앞 건물
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-1">버스 대절 안내</h3>
          <p className="text-gray-600">
            용흥공영주차장(포항시 북구 용흥동 산24-3)에서 2025년 5월 31일(토) 오전 7:30 출발
          </p>
          <p className="text-gray-500 text-xs mt-1">
            ※ 버스는 예약되어 있으니 시간에 맞춰 도착해주세요. 정시에 출발합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
