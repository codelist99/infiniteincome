import {
  CF2Component,
  init_runtime,
  registerComponent
} from "./chunk-7CTAZQES.js";
import {
  __publicField,
  init_define_process
} from "./chunk-RFSPGZ3L.js";

// projects/lib/packages/yggdrasil-blueprints/__generated__/packs/countdown-v1.ts
init_define_process();

// projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/countdown-v1.ts
init_define_process();
init_runtime();
var CountdownV1 = class extends CF2Component {
  constructor(el, runtimeSel) {
    super(el, runtimeSel);
  }
  fixedDigits(num, digits = 2) {
    const numStr = num?.toString() ?? "";
    if (numStr.length < digits) {
      return `${"0".repeat(digits - numStr.length)}${numStr}`;
    } else {
      return numStr;
    }
  }
  mount() {
    const countdown_opts = this.countdown_opts;
    let countdownSpans = 0;
    if (countdown_opts.show_years) countdownSpans |= countdown.YEARS;
    if (countdown_opts.show_months) countdownSpans |= countdown.MONTHS;
    if (countdown_opts.show_weeks) countdownSpans |= countdown.WEEKS;
    if (countdown_opts.show_days) countdownSpans |= countdown.DAYS;
    if (countdown_opts.show_hours) countdownSpans |= countdown.HOURS;
    if (countdown_opts.show_minutes) countdownSpans |= countdown.MINUTES;
    if (countdown_opts.show_seconds) countdownSpans |= countdown.SECONDS;
    const now = /* @__PURE__ */ new Date();
    let countToDate = now;
    try {
      countToDate = new Date(this.end_date_time);
      if (isNaN(countToDate)) {
        countToDate = now;
      }
      if (countToDate < now) {
        countToDate = now;
      }
    } catch (e) {
      console.warn(`liiquid filter 'countdown': Invalid date '${this.end_date_time}'`);
    }
    const { YEARS, MONTHS, WEEKS, DAYS, HOURS, MINUTES, SECONDS } = this.constructor.TIME_TYPES;
    var timerId = countdown(
      countToDate,
      (ts) => {
        if (ts.value < 0) {
          $(`[data-time-type="${YEARS}"`, this.element).find("span").text(ts.years);
          $(`[data-time-type="${MONTHS}"`, this.element).find("span").text(ts.months);
          $(`[data-time-type="${WEEKS}"`, this.element).find("span").text(ts.weeks);
          $(`[data-time-type="${DAYS}"`, this.element).find("span").text(ts.days);
          $(`[data-time-type="${HOURS}"`, this.element).find("span").text(this.fixedDigits(ts.hours, 2));
          $(`[data-time-type="${MINUTES}"`, this.element).find("span").text(this.fixedDigits(ts.minutes, 2));
          $(`[data-time-type="${SECONDS}"`, this.element).find("span").text(this.fixedDigits(ts.seconds, 2));
        } else {
          $(`[data-time-type="${YEARS}"`, this.element).find("span").text("0");
          $(`[data-time-type="${MONTHS}"`, this.element).find("span").text("0");
          $(`[data-time-type="${WEEKS}"`, this.element).find("span").text("0");
          $(`[data-time-type="${DAYS}"`, this.element).find("span").text("0");
          $(`[data-time-type="${HOURS}"`, this.element).find("span").text("00");
          $(`[data-time-type="${MINUTES}"`, this.element).find("span").text("00");
          $(`[data-time-type="${SECONDS}"`, this.element).find("span").text("00");
          clearInterval(timerId);
          if (this.timer_action === "showhide") {
            $(this.hide_ids.map((id) => `.${id}`).join(",")).hide();
            $(this.show_ids.map((id) => `.${id}`).join(",")).show();
          } else if (this.timer_action === "redirect_to") {
            if (this.redirect_to) {
              window.location.href = this.redirect_to;
            }
          }
        }
      },
      countdownSpans
    );
  }
};
// Time type keys used for data-time-type attribute selectors
__publicField(CountdownV1, "TIME_TYPES", {
  YEARS: "years",
  MONTHS: "months",
  WEEKS: "weeks",
  DAYS: "days",
  HOURS: "hours",
  MINUTES: "minutes",
  SECONDS: "seconds"
});
registerComponent("Countdown/V1", CountdownV1);
window["CountdownV1"] = CountdownV1;
//# sourceMappingURL=countdown-v1-IRYI76GQ.js.map
