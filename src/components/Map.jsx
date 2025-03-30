"use client";

import { HALL_NAME, HALL_ADDRESS, HALL_LAT, HALL_LNG } from "@/lib/constants";
import Script from "next/script";
import { Toaster, toast } from "react-hot-toast";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function NavigationAndAddress() {
  // 내비게이션 URL
  const kakaoNaviUrl = `kakaonavi://navigate?name=${HALL_NAME}&coord_type=wgs84&pos_x=${HALL_LNG}&pos_y=${HALL_LAT}`;
  const naverNaviUrl = `nnavimap://navigate?name=${HALL_NAME}&lat=${HALL_LAT}&lng=${HALL_LNG}`;
  const tMapNaviUrl = `tmap://route?goalname=${HALL_NAME}&goalx=${HALL_LNG}&goaly=${HALL_LAT}`;

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
    <div className="flex flex-col items-center justify-center bg-white py-14 gap-10">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
      />

      {/* "오시는 길" 섹션 */}
      <div className="border-2 border-[#ee7685] text-[#ee7685] font-bold px-4 py-2 rounded-full font-crimson">
        오시는 길
      </div>

      {/* 카카오 지도 */}
      <div className="w-full h-96 bg-white relative px-10">
        <Map
          center={{ lat: HALL_LAT, lng: HALL_LNG }}
          style={{ width: "100%", height: "100%" }}
          level={3}
        >
          <MapMarker position={{ lat: HALL_LAT, lng: HALL_LNG }}>
            <div className="text-sm text-black">{HALL_NAME}</div>
          </MapMarker>
        </Map>
      </div>

      {/* 주소 표시 */}
      <div className="flex flex-col gap-2 py-4 font-sans items-start w-full px-10">
        <p className="text-gray-700">{HALL_ADDRESS}</p>
        <p className="font-bold text-black">{HALL_NAME}</p>
      </div>

      {/* 내비게이션 버튼 */}
      <div className="flex flex-col gap-4 w-full px-10">
        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = kakaoNaviUrl)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 flex-1"
          >
            카카오네비
          </button>
          <button
            onClick={() => (window.location.href = naverNaviUrl)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 flex-1"
          >
            네이버네비
          </button>
          <button
            onClick={() => (window.location.href = tMapNaviUrl)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex-1"
          >
            티맵
          </button>
        </div>
      </div>

      {/* 주소 복사 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={copyAddress}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900"
        >
          주소 복사하기
        </button>
      </div>
    </div>
  );
}
