// instagram javascript
// 사용자의 엑세스 토큰을 여기에 입력
var accessToken =
  "IGQWRQamFua0JzLWNudEpIcFY2RnpnRmxkRGdYMmJyYlAzbFB3YzFXUzlkNTVJM0dvM0ozVTRIRllEdVpjY05JOXVmQjduUWUzOW9hMC1yQlFXUHoxSGVvbDRwQzd1MmhSSnVfVUIzU28wNGRQYlRQTjZALWkFDX1EZD";

// 인스타그램 그래프 API 엔드포인트
var apiUrl =
  "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=" +
  accessToken;

// 타임스탬프를 시간으로 변환하는 함수
function calculateTimeAgo(timestamp) {
  var now = new Date();
  var postDate = new Date(timestamp);
  var timeDiff = now - postDate;
  var seconds = Math.floor(timeDiff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);

  if (days > 0) {
    return days + "일 전";
  } else if (hours > 0) {
    return hours + "시간 전";
  } else if (minutes > 0) {
    return minutes + "분 전";
  } else {
    // 새로운 분기: 하루 전보다 적은 경우
    var remainingSeconds = seconds % 60;
    return remainingSeconds + "초 전";
  }
}

// 인스타그램 게시물
function fetchInstagramPosts() {
  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "JSON",
    success: function (response) {
      console.log(response);

      var maxPosts = Math.min(response.data.length, 12); // 최대 게시물 수 제한
      var instaFeed = $("#instagram-feed");

      // 모든 게시물을 위한 단일 컨테이너 생성
      var $instaContainer = $("<div>").addClass("insta-container");

      for (var i = 0; i < maxPosts; i++) {
        var mediaUrl = response.data[i].media_url;
        var caption = response.data[i].caption;
        var timestamp = response.data[i].timestamp;
        var permalink = response.data[i]?.permalink;

        // 캡션의 최대 줄 수를 제한하고 줄바꿈 추가
        var maxCaptionLines = 4;
        var captionLines = caption.split("\n").slice(0, maxCaptionLines);
        var formattedCaption = captionLines.join("<br>");

        // 시간 변환
        var timeAgo = calculateTimeAgo(timestamp);

        // 이미지에 링크 추가
        var $imageLink = $("<a>")
          .attr("href", permalink)
          .attr("target", "_blank");

        var $imageContainer = $("<div>")
          .addClass("insta-image-container")
          .append($imageLink.append($("<img>").attr("src", mediaUrl)));

        // 타임스탬프와 캡션을 추가합니다.
        var $captionContainer = $("<div>").addClass("caption");
        $captionContainer.append(
          '<div class="timestamp">' + timeAgo + "</div>"
        );

        $captionContainer.append(
          '<a href="' +
            permalink +
            '" target="_blank">' +
            formattedCaption +
            "..." +
            (captionLines.length < caption.split("\n").length
              ? '<div type="button" class="read-more-button" data-permalink="' +
                permalink +
                '">더 보기</div>'
              : "")
        );

        // 클로저 문제 해결을 위해 IIFE (즉시 실행 함수)를 사용합니다.
        (function (fullCaption, permalink) {
          $captionContainer.find(".read-more-button").click(function () {
            window.open(permalink, "_blank");
          });
        })(caption, permalink);

        $imageContainer.append($captionContainer);

        $instaContainer.append($imageContainer);
      }

      instaFeed.append($instaContainer);

      $instaContainer.slick({
        infinite: true,
        slidesToShow: 4,
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
    },

    error: function (xhr, status, error) {
      console.error(xhr.responseText);
    },
  });
}

// 페이지 로드 시 인스타그램 게시물 가져오기
fetchInstagramPosts();

// 인스타그램 게시물 주기적으로 업데이트하기
setInterval(fetchInstagramPosts, 24 * 60 * 60 * 1000);

// 인스타그램 페이지로 이동하는 버튼 클릭 이벤트 처리
$("#instagram-button").on("click", function () {
  window.open("https://www.instagram.com/gogumawedding/", "_blank");
});
