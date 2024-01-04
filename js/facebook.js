// facebook javascript
var isExpanded = false;
function getTimeDifferenceString(postTime) {
  const now = new Date();
  const postDate = new Date(postTime);
  const timeDifference = now - postDate;
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  if (minutesDifference < 60) {
    if (minutesDifference === 0) {
      return "방금 전";
    } else {
      return `${minutesDifference}분 전`;
    }
  } else {
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    } else {
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      if (daysDifference === 1) {
        return "어제";
      } else {
        return `${daysDifference}일 전`;
      }
    }
  }
}

function updateFacebookFeed() {
  var pageId = "216684361876104";
  var accessToken =
    "EABhi7JQQ3vkBOZBVGqDKBtOKkA4aWoEZB9pr2NLfMSufysBj4KAzQQ0AfshykVD5lJzvBHvmzeL6BWDNYdgkZCbLGXS7yfciG30EmO3NOpK6JpyNhJ7jsqsjJZC7ilge9biGskClgKZBVvnnOWqVLHXSUJ99RWEnGyVVAy0ZCG07F8EtFdPtuS1AE1PrSYYHcZD";

  $.ajax({
    url: `https://graph.facebook.com/v18.0/${pageId}/posts`,
    method: "GET",
    data: {
      fields: "created_time,message,message_tags,full_picture,id",
      access_token: accessToken,
      limit: 12,
    },
    success: function (data) {
      var feedContainer = $("#facebook-feed");
      feedContainer.empty();

      for (var i = 0; i < data.data.length; i++) {
        var post = data.data[i];
        var postContainer = $("<div>").addClass("post-container");

        if (post.full_picture) {
          var imageElement = $("<img>").attr("src", post.full_picture);

          (function (postId) {
            imageElement.click(function () {
              window.open("https://www.facebook.com/" + postId, "_blank");
            });
          })(post.id);

          postContainer.append(imageElement);
        }

        // 작성시간
        if (post.created_time) {
          var timeDifferenceString = getTimeDifferenceString(post.created_time);
          var timeElement = $("<div>")
            .addClass("time")
            .text(timeDifferenceString);

          postContainer.append(timeElement);
        }

        // 텍스트
        if (post.message) {
          var messageLines = post.message.replace(/(\S)/, "\n$1").split("\n");

          // 가져올 줄 수
          var linesToDisplay = 5;

          // 처음부터 지정된 줄 수까지의 텍스트를 가져오기
          var truncatedMessage = messageLines
            .slice(0, linesToDisplay)
            .join("<br>");

          // 텍스트를 표시하는 부분을 수정
          var postContent = $("<div>")
            .addClass("content")
            .html(
              truncatedMessage +
                "..." +
                '<div type="button" class="post-button">더보기</div>'
            );

          (function (postId) {
            postContent.click(function () {
              window.open("https://www.facebook.com/" + postId, "_blank");
            });
          })(post.id);

          postContainer.append(postContent);
        }

        feedContainer.append(postContainer);
      }

      feedContainer.slick({
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

      // Add an event listener for the beforeChange event
      // $("#facebook-feed").on(
      //   "beforeChange",
      //   function (event, slick, currentSlide, nextSlide) {
      //     // Remove the custom-style class from all slides
      //     $(".slick-slider div").removeClass("custom-style");
      //     // Add the custom-style class to the middle slide (adjust index as needed)
      //     if (nextSlide === 2) {
      //       $(
      //         '.your-slider div[data-slick-index="' + nextSlide + '"]'
      //       ).addClass("custom-style");
      //     }
      //   }
      // );
    },
    error: function (error) {
      console.error("페이스북 데이터를 가져오는 데 실패했습니다:", error);
    },
  });
}
// 페이스북 페이지로 이동하는 버튼 클릭 이벤트 처리
$("#facebook-button").on("click", function () {
  window.open("https://www.facebook.com/ggmwedy/", "_blank");
});

updateFacebookFeed();
setInterval(updateFacebookFeed, 24 * 60 * 60 * 1000);
