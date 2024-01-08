import { NextRequest } from "next/server";
import fetch from "node-fetch";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

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

    const width = searchParams.get("size") ? searchParams.get("size") : 100
    const height = searchParams.get("size") ? searchParams.get("size") : 100
    const bgColor = searchParams.get("bgColor") ? searchParams.get("bgColor") : '#f0f0f0'
    
    // SVGの作成
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
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
            .hide {
              visibility: hidden;
            }
        </style>
        <rect x="0" y="0" width="${width}" height="${height}" fill="${bgColor}" class="fade-in" />
        <image href="${json.avatar_url}" width="${width}" height="${height}" class="fade-in" />
        <text x="50%" y="80%" font-size="1.5rem" fill="#000" stroke="#fff" stroke-width="1" dominant-baseline="middle" text-anchor="middle" class="fade-in">
            ${username.split('').map(str => `<tspan class="hide">${str}</tspan>`).join('')}
        </text>
        <script>
            const timer = setInterval(()=>{
              if(document.getElementsByClassName('hide').length === 0) {
                clearInterval(timer)
              } 
              document.getElementsByClassName('hide')[0].classList.remove("hide")
            }, 100)
        </script>
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
