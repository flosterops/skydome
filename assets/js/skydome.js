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
  if ($("body").hasClass("require-store-token") && !Cookies.get("storeToken")) {
    window.location.href = `https://session.draft.int.one.gamigo.com/login?service=https://${window.location.hostname}/sso.html`;
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
    const passVisibleElem = $("form#register-form #pass-visible");
    const passHiddenElem = $("form#register-form #pass-hidden");

    if (passwordTypes === "text") {
      element.attr("type", "password");
      passHiddenElem.show();
      passVisibleElem.hide();
    } else {
      element.attr("type", "text");
      passHiddenElem.hide();
      passVisibleElem.show();
    }
  });

  $("button#registration").prop("disabled", true);

  [
    $("form#register-form #password"),
    $("form#register-form #email"),
    $("form#register-form #age"),
    $("form#register-form #tos"),
  ].forEach(($elem) => {
    $elem.on("change", function (ev) {
      const password = $("form#register-form #password").val();
      const email = $("form#register-form #email").val();
      const age = $("form#register-form #age").val();
      const tos = !!$("form#register-form #tos").attr("checked");
      const isFormValid =
        validatePassword(password) &&
        validateEmail(email) &&
        validateAge(age) &&
        validateTos(tos);
      const submitButton = $("form#register-form #registration");
      submitButton.prop("disabled", !isFormValid);
    });
  });

  function getLang() {
    let lang = window.location.href.replace(window.origin + "/", "");
    return lang.substr(0, lang.indexOf("/"));
  }

  function showRegError(code) {
    if (code !== "unknown_error") {
      $(".reg-status").text(ERRORS[code] || ERRORS["unknown"]);
    }
  }

  $("form#register-form").on("submit", function (event) {
    event.preventDefault();

    const email = $("form#register-form #email").val();
    const password = $("form#register-form #password").val();
    const age = $("form#register-form #age").val();
    const currentYear = new Date().getFullYear();
    const dob = `${currentYear - age}-12-31`;
    const optin = $("input[name=optin]").is(":checked")
      ? "<channel>skydomebeta</channel>"
      : "";
    const registerURl =
      "https://glyph.draft.int.one.gamigo.com/api/v1_2/register-account.action?X-GameServer-Channel=4111";
    const requestData = `<?xml version="1.0" encoding="UTF-8"?>
      <accountCreateRequest version="1.2">
        <account>
          <firstName> </firstName>
          <lastName> </lastName>
          <dateOfBirth>${dob}</dateOfBirth>
          <emailAddress>${email}</emailAddress>
          <password>${password}</password>
          <languageCode>en_US</languageCode>
          <affiliateId></affiliateId>
          <optInChannels>${optin}</optInChannels>
          </account>
        </accountCreateRequest>`;

    $(".loader").removeClass("hidden");

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
              showRegError($(elem).attr("code"));
            });
        } else {
          const storeToken = $(data).find("storeToken").text();
          Cookies.set("storeToken", storeToken);
          const accountId = $(data).find("accountId").text();
          if (
            accountId &&
            GmgSession &&
            GmgSession.hasOwnProperty("sendRegistrationEvent")
          ) {
            GmgSession.sendRegistrationEvent(accountId, "Landing Page");
          }
          const lang = getLang();
          window.location.href = `${window.origin}/${lang}/beta-survey.html`;
        }
      })
      .fail(function (e) {
        console.log(e);
      })
      .always(function () {
        $(".loader").addClass("hidden");
      });
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

  $("form#register-form #password").on("focus", function (event) {
    const passErrors = $("form#register-form .password-errors");
    passErrors.show();
  });

  $("form#register-form #password").on("blur", function (event) {
    const passErrors = $("form#register-form .password-errors");
    passErrors.hide();
    if (validatePassword(event.target.value));
  });

  $("form#register-form #password").on("input", function (event) {
    const value = event.target.value;
    const oneAlph = $("#one-alphabetic-error");
    const numAndSpecial = $("#one-num-and-special-error");
    const lengthErr = $("#length-error");

    const min = 8;
    const max = 32;
    const isMoreThanMin = value.length > min - 1;
    const isLessThanMax = value.length < max - 1;
    const hasUppercase = new RegExp(/(.*[A-Z].*)/).test(value);
    const hasSpecialChapter = new RegExp(/(?=.*[-+_!@#$%^&*., ?])/).test(value);

    if (isMoreThanMin && isLessThanMax) {
      lengthErr.addClass("success-color");
      lengthErr.removeClass("error-color");
    } else {
      lengthErr.removeClass("success-color");
      lengthErr.addClass("error-color");
    }

    if (hasUppercase) {
      oneAlph.addClass("success-color");
      oneAlph.removeClass("error-color");
    } else {
      oneAlph.removeClass("success-color");
      oneAlph.addClass("error-color");
    }

    if (hasSpecialChapter) {
      numAndSpecial.addClass("success-color");
      numAndSpecial.removeClass("error-color");
    } else {
      numAndSpecial.removeClass("success-color");
      numAndSpecial.addClass("error-color");
    }
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
    const storeToken = Cookies.get("storeToken");
    const data = $(this).serializeArray();
    const questionsCount = $(".survey-questions > li").length - 1;
    var answers = {};

    // check store token
    if (!storeToken) {
      alert("Please, sign in first");
      return;
    }

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
      alert("Please, answer all questions first");
      return;
    }

    // add optional fields if provided
    if (
      $("input[name=7]:checked").val() === "a" &&
      $("input[name=7a]").val() !== ""
    ) {
      answers["7a"] = $("input[name=7a]").val();
    }

    // generate query parameters
    const query = $.param({
      phone: $("input[name=phone]").val(),
      optin: $("input[name=optin]").is(":checked"),
      storeToken: storeToken,
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

  $(".language-switcher > ul > li").click(function () {
    const lang = $(this).data("lang") || "en";
    Cookies.set("language", lang);
    window.location.href = "/" + lang + window.location.pathname.substring(3);
  });

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
