import {
  IntlTel_initPhoneInput,
  init_cf_utils
} from "./chunk-VVEAJADP.js";
import {
  CF2Component,
  init_runtime,
  registerComponent
} from "./chunk-7CTAZQES.js";
import {
  __esm,
  __publicField,
  init_define_process
} from "./chunk-RFSPGZ3L.js";

// projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/checkbox-v1.ts
var CheckboxV1;
var init_checkbox_v1 = __esm({
  "projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/checkbox-v1.ts"() {
    init_define_process();
    init_runtime();
    CheckboxV1 = class extends CF2Component {
      constructor(el, runtimeSel) {
        super(el, runtimeSel);
        __publicField(this, "checkbox");
      }
      mount() {
        this.checkbox = this.element.querySelector(".elCheckboxInput");
        this.preventClickOnLabel = this.element.getAttribute("data-prevent-click-on-label");
        if (this.element.dataset.triggerClickOnWrapper == "true") {
          this.element.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            e.preventDefault();
            this.toggle();
          });
        } else if (this.preventClickOnLabel == "true") {
          this.element.querySelector(".elCheckboxLabel").addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            e.preventDefault();
          });
          this.element.querySelector(".elCheckbox").addEventListener("click", (e) => {
            this.toggle();
          });
        } else {
          this.element.addEventListener("click", (evt) => {
            if (evt.target.closest("a")) return;
            evt.preventDefault();
            this.toggle();
          });
          this.checkbox.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
        }
        if (this.useCheckboxIcon) {
          const fakeCheckbox = this.element.querySelector(".elCheckbox");
          fakeCheckbox.addEventListener("click", () => {
            this.toggle();
          });
        }
      }
      toggle() {
        this.setChecked(!this.checkbox.checked);
      }
      setChecked(checked) {
        const event = new Event("change");
        this.checkbox.checked = checked;
        this.checkbox.dispatchEvent(event);
      }
    };
    registerComponent("Checkbox/V1", CheckboxV1);
    window["CheckboxV1"] = CheckboxV1;
  }
});

// projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/input-v1.ts
var InputV1;
var init_input_v1 = __esm({
  "projects/lib/packages/yggdrasil-blueprints/__generated__/blueprints/input-v1.ts"() {
    init_define_process();
    init_cf_utils();
    init_runtime();
    InputV1 = class extends CF2Component {
      constructor(el, runtimeSel) {
        super(el, runtimeSel);
      }
      mount() {
        this.input = this.element.querySelector(".elInput");
        this.re = /^(([^<>()[\]\.,;:#%\s@"]+(\.[^<>()[\]\.,;:#%\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.input.getAttribute("name") === "shipping_zip") {
          this.input.setAttribute("maxlength", "10");
        }
        this.addInputListeners();
        if (this.isStandalonePhoneNumberInput()) {
          this.setupPhoneNumberInput();
        }
      }
      update() {
        if (this.input.value) {
          this.element.classList.add("hasValue");
        } else {
          this.element.classList.remove("hasValue");
        }
      }
      isStandalonePhoneNumberInput() {
        return this.input.getAttribute("name") === "phone_number" && !$(this.input).closest('[data-page-element="Checkout/V1"]').length && !$(this.input).closest('[data-page-element="Checkout/V2"]').length && !$(this.input).closest('[data-page-element="Survey/V1').length;
      }
      addInputListeners() {
        this.input.addEventListener("focus", () => {
          this.element.querySelector("[data-input-status-type]").innerHTML = "";
          this.element.classList.remove("elInputValid");
          this.element.classList.remove("elInputError");
          this.element.classList.remove("elInputWarning");
          this.element.classList.add("elInputFocused");
        });
        if (this.isStandalonePhoneNumberInput() && this.input.iti) {
          this.input.addEventListener("countrychange", () => {
            const newCountry = this.input.iti.getSelectedCountryData().iso2;
            document.querySelectorAll('[name="phone_number"]').forEach((s) => {
              if (s.iti) {
                s.iti.setCountry(newCountry);
              }
            });
          });
        }
        this.input.addEventListener("blur", () => {
          this.element.classList.remove("elInputFocused");
          this.update();
          if (this.input.getAttribute("name") === "phone_number" && this.input.iti) {
            document.querySelectorAll('[name="phone_number"]').forEach((s) => {
              if (s.iti) {
                s.iti.setCountry(this.input.iti.getSelectedCountryData().iso2);
                s.iti.setNumber(this.input.value);
              }
            });
          }
          if (this.input.classList.contains("required1") && this.element.matches(".elInputError")) {
            if (this.input.value === "") {
              return;
            } else {
              if (this.input.getAttribute("name") === "email") {
                const parsedEmail = $.trim(input.value);
                if (this.re.test(parsedEmail)) {
                  this.element.classList.add("elInputValid");
                  this.element.classList.remove("elInputError");
                }
              } else if (this.isStandalonePhoneNumberInput() && !window.intlTelInput.utils.isValidNumber(this.input.value)) {
                this.element.classList.remove("elInputValid");
                this.element.classList.add("elInputError");
              } else {
                this.element.classList.remove("elInputError");
                this.element.classList.add("elInputValid");
              }
            }
          }
        });
      }
      setupPhoneNumberInput() {
        IntlTel_initPhoneInput(this.input);
      }
    };
    registerComponent("Input/V1", InputV1);
    window["InputV1"] = InputV1;
  }
});

export {
  init_checkbox_v1,
  init_input_v1
};
//# sourceMappingURL=chunk-USXYI4AH.js.map
