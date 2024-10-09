import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { StoreApiResponse, StoreType } from "@/interface";

export default async function handler(
  req: NextApiRequest,
  // 8. interface 업데이트하기 StoreType[] -> StoreApiResponse
  res: NextApiResponse<StoreApiResponse | StoreType[]>
) {
  // 4. req.query에서 page값을 가져온다.
  const { page = "" }: { page?: string } = req.query;
  const prisma = new PrismaClient();

  if (page) {
    // 8. totalCount는 prisma의 count 함수를 사용해서 총 레코드의 갯수가 몇개인지 넘겨준다.
    const count = await prisma.store.count();
    // page가 1부터 시작하기 때문에 skipPage변수를 만들어서 사용
    const skipPage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
      // 5. store 내부에 항상 10개만 가져온다
      take: 10,
      // 6. 첫번째 페이지에서는 10개만 보여지고 다음페이지에서는 전 페이지 10개를 건너뛰고 다음 10개를 보여준다.
      skip: skipPage * 10,
    });

    // totalPage, data, page, totalCount를 전달해야 함 -> totalCount, totalPage를 통해서 총 몇개의 페이지가 있는지 확인을 해야하기 때문에
    // 7. totalPage, data, page 넘기기
    //  기존에 stores를 넘기는 방식이 아닌 아래와 같이 수정
    res.status(200).json({
      page: parseInt(page),
      data: stores,
      totalCount: count,
      totalPage: Math.ceil(count / 10),
    });
  } else {
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
    });
    return res.status(200).json(stores);
  }
}
