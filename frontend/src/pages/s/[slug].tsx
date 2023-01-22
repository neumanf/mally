import { GetServerSidePropsContext } from "next";

import { ENDPOINTS } from "@/api/endpoints";

export default function UrlShortenerRedirect() {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/s/${context.query.slug}`;
    const res = await fetch(
      `${ENDPOINTS.baseUrl}${ENDPOINTS.urlShortener}/redirect?url=${url}`
    );

    if (!res.redirected) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    return {
      redirect: {
        permanent: false,
        destination: res.url,
      },
    };
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
}
