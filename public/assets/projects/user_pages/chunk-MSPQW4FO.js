import {
  CF2Component,
  init_runtime,
  registerComponent
} from "./chunk-7CTAZQES.js";
import {
  __esm,
  init_define_process
} from "./chunk-RFSPGZ3L.js";

// projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/radio-v1.ts
var RadioV1;
var init_radio_v1 = __esm({
  "projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/radio-v1.ts"() {
    init_define_process();
    init_runtime();
    RadioV1 = class extends CF2Component {
      constructor(el, runtimeSel) {
        super(el, runtimeSel);
      }
      mount() {
        const radioInput = this.element.querySelector(".elRadioInput");
        if (this.element.dataset.triggerClickOnWrapper == "true") {
          this.element.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            e.preventDefault();
            this.enableRadio(radioInput);
          });
        }
      }
      enableRadio(radio) {
        const event = new Event("change");
        if (!radio.checked) radio.checked = true;
        radio.dispatchEvent(event);
      }
    };
    registerComponent("Radio/V1", RadioV1);
    window["RadioV1"] = RadioV1;
  }
});

export {
  init_radio_v1
};
//# sourceMappingURL=chunk-MSPQW4FO.js.map
