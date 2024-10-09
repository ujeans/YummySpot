import React, { useCallback, useEffect, useRef } from "react";

import Image from "next/image";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";

import { StoreType } from "@/interface";

import Loading from "@/components/Loading";
import Loader from "@/components/Loader";

import useIntersectionObserver from "@/hook/useIntersectionObserver";

export default function StoreListPage() {
  // 1. 현재 페이지가 어떤 페이지인지 보여주기 위해서는 query params를 사용
  const router = useRouter();
  const { page = "1" }: any = router.query; // stores?page=3 페이지가 넘어갈 때마다 page query가 변하게 된다.
  const ref = useRef<HTMLDivElement>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;

  // 2. 무한스크롤: 2
  const fetchStores = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/stores?page=" + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
      },
    });

    return data;
  };

  // 무한스크롤: 1
  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery("stores", fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [fetchNextPage, isPageEnd]);

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
          stores?.pages?.map((page, index) => {
            return (
              <React.Fragment key={index}>
                {page.data.map((store: StoreType, i) => (
                  <li className="flex justify-between gap-6 py-5" key={i}>
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
                        {store?.phone || "번호 없음"} | {store?.foodCertifyName}{" "}
                        | {store?.category}
                      </div>
                    </div>
                  </li>
                ))}
              </React.Fragment>
            );
          })
        )}
      </ul>
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </div>
  );
}
