import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { StoreType } from "@/interface";

export default function StoreDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const fetchStore = async () => {
    const { data } = await axios(`/api/stores?id=${id}`);
    return data as StoreType;
  };

  const {
    data: store,
    isFetching,
    isError,
  } = useQuery(`store-${id}`, fetchStore, {
    enabled: !!id, // router에 data값이 없으면 데이터를 가져오지 않도록
  });

  console.log(store, isFetching, isError);

  return <div>StoreDetailPage: {id}</div>;
}
