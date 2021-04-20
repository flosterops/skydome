!(function (a, b, c, d) {
  a.fn.doubleTapToGo = function (d) {
    return (
      !!(
        "ontouchstart" in b ||
        navigator.msMaxTouchPoints ||
        navigator.userAgent.toLowerCase().match(/windows phone os 7/i)
      ) &&
      (this.each(function () {
        var b = !1;
        a(this).on("click", function (c) {
          var d = a(this);
          d[0] != b[0] && (c.preventDefault(), (b = d));
        }),
          a(c).on("click touchstart MSPointerDown", function (c) {
            for (
              var d = !0, e = a(c.target).parents(), f = 0;
              f < e.length;
              f++
            )
              e[f] == b[0] && (d = !1);
            d && (b = !1);
          });
      }),
      this)
    );
  };
})(jQuery, window, document);

(function () {
  if ($("body").hasClass("require-store-token") && !Cookies.get('trion-store-token')) {
    alert("Please sign in first");
    window.location.href = "/";
  }

  $(document).on("submit", "form.registration-form", function (e) {
    e.preventDefault();
    var data = JSON.stringify({
      channel: "SKYDOME",
      email: $("#email-newsletter").val(),
      language: "en-US",
    });
    var xhr = new XMLHttpRequest();
    var url = "https://newsletter.trionworlds.com/api/subscribe";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          /*GmgSession.sendClickedRegisterEvent('', 'Landing Page');*/
          $("#modal").toggleClass("open");
          $("#modal-overlay").toggleClass("open");
          $("#modal-text").text(
            "Thank you for your interest in Skydome Beta! Check your inbox for a confirmation email."
          );
          document.getElementById("newsletter-form").reset();
          document.getElementById("confirmation").checked = false;
        } else {
          $("#modal").toggleClass("open");
          $("#modal-overlay").toggleClass("open");
          $("#modal-text").text("Error, please try again later.");
        }
      }
    };
    xhr.send(data);
  });

  $("#pass-visibility").on("click", function () {
    const element = $("form#register-form #password");
    const passwordTypes = element.attr("type");
    if (passwordTypes === "text") {
      element.attr("type", "password");
    } else {
      element.attr("type", "text");
    }
  });

  $("form#register-form").on("submit", function (event) {
    event.preventDefault();

    const email = $("form#register-form #email").val();
    const password = $("form#register-form #password").val();
    const age = $("form#register-form #age").val();
    const currentYear = new Date().getFullYear();
    const dob = `${currentYear - age}-12-31`;
    const registerURl =
      "https://glyph.draft.int.one.gamigo.com/api/v1_2/register-account.action";
    const requestData = `<?xml version="1.0" encoding="UTF-8"?>
      <accountCreateRequest version="1.2">
        <account>
          <firstName> </firstName>
          <lastName> </lastName>
          <dateOfBirth>${dob}</dateOfBirth>
          <countryCode>ua</countryCode>
          <emailAddress>${email}</emailAddress>
          <password>${password}</password>
          <languageCode>en_US</languageCode>
          <affiliateId></affiliateId>
          <optInChannels>
            <channel>skydome</channel>
          </optInChannels>
          </account>
        </accountCreateRequest>`;

    $.ajax({
      url: registerURl,
      method: "POST",
      contentType: "plain/text",
      data: requestData,
    })
      .done(function (data) {
        if (!!$(data).find("errors").children().toArray().length) {
          $(data)
            .find("errors")
            .children()
            .toArray()
            .forEach((elem) => {
              console.error("Registration error:" + $(elem).attr("code"));
            });
        } else {
          const storeToken = $(data).find("storeToken").text();
          Cookies.set("trion-store-token", storeToken);
        }
      })
      .fail(function (e) {
        console.log(e);
      })
      .always(function () {});
  });

  function validateEmail(value) {
    // Email reg exp
    return new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$").test(
      value
    );
  }

  function validateAge(value) {
    return value && value > 0;
  }

  function validatePassword(value) {
    const min = 8;
    const max = 32;
    const isMoreThanMin = value.length > min - 1;
    const isLessThanMax = value.length < max - 1;
    const hasUppercase = new RegExp(/(.*[A-Z].*)/).test(value);
    const hasSpecialChapter = new RegExp(/(?=.*[-+_!@#$%^&*., ?])/).test(value);

    return isMoreThanMin && isLessThanMax && hasUppercase && hasSpecialChapter;
  }

  function validateTos(checked) {
    return !!checked;
  }

  $("form#register-form #email").on("blur", function (event) {
    const emailError = $("#email-error");

    if (validateEmail(event.target.value)) {
      emailError.hide();
    } else {
      emailError.show();
    }
  });

  $("form#register-form #password").on("blur", function (event) {
    if (validatePassword(event.target.value));
  });

  $("form#register-form #age").on("blur", function (event) {
    const ageError = $("#age-error");
    if (validateAge(event.target.value)) {
      ageError.hide();
    } else {
      ageError.show();
    }
  });

  $("form#register-form #tos").on("change", function (event) {
    const tosError = $("#tos-error");
    if (validateTos(event.target.checked)) {
      tosError.hide();
    } else {
      tosError.show();
    }
  });

  $(document).on("submit", "form#beta-survey-form", function (ev) {
    ev.preventDefault();

    const version = $("input[name=version]").val();
    const language = "en";
    const data = $(this).serializeArray();
    const questionsCount = $(".survey-questions > li").length - 1;
    var answers = {};

    // transform form data into answers object
    data
      .filter((e) => !isNaN(e.name) && e.value !== "")
      .forEach((e) => {
        if (answers[e.name] === undefined) {
          answers[e.name] = e.value;
        } else {
          answers[e.name] += ", " + e.value;
        }
      });

    // verify answer count
    if (Object.keys(answers).length !== questionsCount) {
      alert("Please, answer all questions first.");
      return;
    }

    // generate query parameters
    const query = $.param({
      phone: $("input[name=phone]").val(),
      optin: $("input[name=optin]").is(":checked"),
      storeToken:
        "aXZ-U3h0SGRjTGVsSTFlNG5JZmZ3THhoQSZkYXRhfnlpNGhhMG1PSjRNQTVzOTlZQ3lZUHc0ZHBQSTdSZE1HZVBoeVZZVWkzMl9ob2pUUE5nS3ZhZFBvdjZBM0hOU01RLVY3bjVtZHNSMmtsZVVtQTYtRVVZUV9ybUFobWM4Z0tlWndlOFlYYTNmUUN4S2dIYzZiM3AtMjhibVdVUjA1Uk1Sckp1SFhYTGJmQnlTdWJvNUF1T3VhQnlrUE9WeGNzX2NQeXJZN1FrWndWX0hWaVZLZ0Yyb2c4VUMtNk5TTkstWmVZdURDemxOcjN2cG81eGM2VEEtMGpGbnVsZEZLeEdlbVpEcDk4dE4wbFoxZnBhY1RiQUZJTV9UeTRWazJOVGRDTTYzNlJNZVdKb1QyNDF4NlpmczJ4LUtQNTFWZ1B6TFF1Wk5HV0Zkb3VQU0hkY29ZRHRFeUMzTDNUTUN2TWhfVU5Qc3BYcTh3RnU1SWxFSEo1QTFaUnBXVE5PaGZQSmVVQmhyaFdDUm1HRW9WbFhoc2puR25fTk5ObjRjMkFSeG5FYXlZZVo4Z04yWHp4b2hUVGQ2MThkbF9ySlRvZmE3SDM3N0RwRHRxbmt1ZjhhSHBPZ3pYTl80SzVyVXNmLUpCMURsSFhzelJnMXF3UDk3NzhmdDhQb0dSeDJUeF9CNEVWRFZHNko0d05lSkVuUHFBa05XN3BOV3o0TjMwM2MxOU1IMHZVQ3NxcWZKd0dHUkw2UQAA",
    });

    // display loader
    $(".survey-wrapper").hide();
    $(".survey-loader").removeClass("hidden");

    // send request
    $.ajax({
      url: `https://betasurvey.draft.int.one.gamigo.com/api/survey/${version}/${language}/?${query}`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(answers),
    })
      .done(function () {
        $(".survey-result.success").removeClass("hidden");
      })
      .fail(function () {
        $(".survey-result.failure").removeClass("hidden");
      })
      .always(function () {
        $(".survey-loader").hide();
      });
  });
})();

$(document).ready(function () {
  $(".dropdown").doubleTapToGo();
  /*if($('.sidebar').length>0){
        $(".sidebar").sidebar("attach events",".toc"),$(".sidebar a.item").on("click",function(){$(".sidebar").sidebar("hide")});
    };*/

  $("#close-button").click(function () {
    $("#modal").toggleClass("open");
    $("#modal-overlay").toggleClass("open");
  });

  $(function () {
    var Accordion = function (el, multiple) {
      this.el = el || {};
      this.multiple = multiple || false;

      // Variables privadas
      var links = this.el.find(".link");
      // Evento
      links.on(
        "click",
        { el: this.el, multiple: this.multiple },
        this.dropdown
      );
    };

    Accordion.prototype.dropdown = function (e) {
      var $el = e.data.el;
      ($this = $(this)), ($next = $this.next());

      $next.slideToggle();
      $this.parent().toggleClass("open");

      if (!e.data.multiple) {
        $el.find(".desc").not($next).slideUp().parent().removeClass("open");
      }
    };

    var accordion = new Accordion($("#accordion"), false);
  });

  window.lazySizesConfig = window.lazySizesConfig || {};
  window.lazySizesConfig.lazyClass = "lazyload";

  $(".n_about").on("click", function () {
    $("html, body").animate({ scrollTop: $("#game").offset().top - 50 }, 1000);
  });

  $(".n_features").on("click", function () {
    $("html, body").animate(
      { scrollTop: $("#features").offset().top - 75 },
      1000
    );
  });

  $(".n_media").on("click", function () {
    $("html, body").animate({ scrollTop: $("#media").offset().top - 85 }, 1000);
  });

  $(".signup, .signup-now").on("click", function () {
    $("html, body").animate(
      { scrollTop: $("#signup").offset().top + 320 },
      1000
    );
  });

  $("#totop").click(function (event) {
    $("html,body").animate({ scrollTop: 0 }, 1000);
  });

  /*if($(document).width() > "768") {
    $('.screenshots').slick({
        centerMode: true,
        centerPadding: '500px',
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        arrows: false,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                centerMode: true,
                centerPadding: '500px',
                slidesToShow: 1
                }
            },
            {
                breakpoint: 1200,
                settings: {
                centerMode: true,
                centerPadding: '300px',
                slidesToShow: 1
                }
            },
            {
            breakpoint: 768,
            settings: {
                centerMode: true,
                centerPadding: '100px',
                slidesToShow: 1
                }
             },
        ]
    });
    }*/

  splide = new Splide("#splide", {
    type: "loop",
    arrows: false,
    autoWidth: true,
    pagination: true,
    lazyLoad: "nearby",
    focus: "center",
    breakpoints: {
      480: {
        destroy: true,
      },
    },
  }).mount();

  var params = new URLSearchParams(window.location.search);
  var token = params.get("token");
  if (token) {
    var data = JSON.stringify({
      token: token,
    });
    var xhr = new XMLHttpRequest();
    var url = "https://newsletter.trionworlds.com/api/subscribeDoubleOptIn";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          /*GmgSession.sendRegistrationEvent('', 'Landing Page');*/
          /*var urlConfirmation = new URL(window.location.origin)+ 'confirmation.html';
                    window.open(urlConfirmation);*/
          window.location.href = "https://playskydome.com/confirmation.html";
        }
      }
    };
    xhr.send(data);
  }
});
