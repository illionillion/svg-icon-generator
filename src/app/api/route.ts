import { NextRequest } from "next/server";
import fetch from "node-fetch";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const size = sizeCheck(searchParams.get("size") as string);
    const bgColor = searchParams.get("bgColor")
      ? searchParams.get("bgColor")
      : "#f0f0f0";

    if (!username) {
      return new Response(JSON.stringify({ message: "クエリが不正です。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const github = await fetch(`https://api.github.com/users/${username}`);
    const json: any = await github.json();
    if (!Object.keys(json).includes("avatar_url")) {
      return new Response(JSON.stringify({ message: "400 Bad Request." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const icon = await fetch(json.avatar_url);
    const buffer = await icon.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    // SVGの作成
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="circleClip">
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
        </clipPath>
      </defs>
        <style>
            .fade-in {
                opacity: 0; /* 最初は透明にする */
                animation: fadeInAnimation 1s ease-in forwards; /* フェードインのアニメーションを適用 */
            }
            @keyframes fadeInAnimation {
                from {
                    opacity: 0; /* 透明から開始 */
                }
                to {
                    opacity: 1; /* 完全に表示されるまでフェードイン */
                }
            }
            tspan {
              display: inline-block;
              animation: fadeInAnimation 1s forwards;
              opacity: 0;
            }
            ${username
              .split("")
              .map(
                (_, index) => `tspan:nth-child(${index + 1}) {
                animation-delay: ${0.1 * (index + 1)}s
              }`
              )
              .join("")}
        </style>
        <rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}" class="fade-in" />
        <image href="${imageUrl}" width="${size}" height="${size}" class="fade-in" clip-path="url(#circleClip)" />
        <text x="50%" y="80%" font-size="1.5rem" fill="#000" stroke="#fff" stroke-width="1" dominant-baseline="middle" text-anchor="middle" class="fade-in">
            ${username
              .split("")
              .map((str) => `<tspan>${str}</tspan>`)
              .join("")}
        </text>
    </svg>`;

    // SVGをレスポンスとして返す
    return new Response(svg, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "取得に失敗しました。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const sizeCheck = (size: string): number => {
  if (isNaN(parseInt(size)) || parseInt(size) === 0) {
    return 100;
  }
  return parseInt(size);
};
