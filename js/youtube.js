const apiKey = "AIzaSyD1gDizKlzCvh-D2JyNye4PJFIiGtFio1g";
const channelId = "UCzqLquzfuh-mfgu6FVWUAOA";

const script = document.createElement("script");
script.src = "https://apis.google.com/js/api.js";
document.head.appendChild(script);

function fetchAndDisplayVideos() {
  script.onload = () => {
    gapi.load("client", () => {
      const videosContainer = document.getElementById("videos-container");

      gapi.client
        .init({
          apiKey: apiKey,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
          ],
        })
        .then(() => {
          return gapi.client.youtube.search.list({
            part: "snippet",
            channelId: channelId,
            type: "video",
            order: "viewCount", // 조회수가 높은 순으로 정렬
            maxResults: 6,
            fields: "items(id(videoId))", // 필요한 필드만 지정
          });
        })
        .then((response) => {
          response.result.items.forEach((video) => {
            const videoContainer = document.createElement("div");
            videoContainer.className = "video-container";
            videoContainer.innerHTML = `
                            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                        `;
            videosContainer.appendChild(videoContainer);
          });

          // Slick 슬라이더 초기화 코드
          $(document).ready(function () {
            $(videosContainer).slick({
              infinite: true,
              slidesToShow: 3,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 5000,
              initialSlide: 0,
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 1180,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                  },
                },
              ],
              pauseOnHover: true,
              pauseOnFocus: true,
              prevArrow:
                '<button type="button" class="slick-prev slick-round-btn"><img src="./img/left_bright.png" alt=""></button>',
              nextArrow:
                '<button type="button" class="slick-next slick-round-btn"><img src="./img/right_bright.png" alt=""></button>',
            });
          });
        })
        .catch((error) => {
          console.error("Error loading YouTube API", error);
        });
    });
  };
}

fetchAndDisplayVideos();
setInterval(fetchAndDisplayVideos, 24 * 60 * 60 * 1000);
