import Image from "next/image";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { StoreApiResponse } from "@/interface";

import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";

export default function StoreListPage() {
  // 1. 현재 페이지가 어떤 페이지인지 보여주기 위해서는 query params를 사용
  const router = useRouter();
  const { page = "1" }: any = router.query; // stores?page=3 페이지가 넘어갈 때마다 page query가 변하게 된다.

  const {
    isLoading,
    isError,
    data: stores,
    // 2. 변경된 page query 값을 useQuery에 넘겨준다. 이때 queryKey는 stores가 아니라 page마다 다른 query를 호출하기 때문에 stores에 page값을 넘겨준다.
  } = useQuery(`stores-${page}`, async () => {
    // 3. api/stores에서도 queryKey값으로 넘겨준다
    const { data } = await axios(`/api/stores?page=${page}`);
    return data as StoreApiResponse;
  });

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.data?.map((store, index) => {
            return (
              <li className="flex justify-between gap-6 py-5" key={index}>
                <div className="flex gap-x-4">
                  <Image
                    src={
                      store?.category
                        ? `/images/markers/${store?.category}.png`
                        : "/images/markers/default.png"
                    }
                    width={48}
                    height={48}
                    alt="아이콘 이미지"
                  />
                  <div>
                    <div className="text-sm font-semibold leading-9 text-gray-900">
                      {store?.name}
                    </div>
                    <div className="mt-1 text-xs truncate font-semibold leading-6 text-gray-500">
                      {store?.storeType}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <div className="text-sm font-semibold leading-9 text-gray-900">
                    {store?.address}
                  </div>
                  <div className="mt-1 text-xs truncate font-semibold leading-6 text-gray-500">
                    {store?.phone || "번호 없음"} | {store?.foodCertifyName} |{" "}
                    {store?.category}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
      {/* 1. pagination 컴포넌트 만들기 */}
      {stores?.totalPage && (
        <Pagination total={stores?.totalPage} page={page} />
      )}
    </div>
  );
}
