// Libraries
import Vue from "vue";
import Vuetify from "vuetify";

// Components
import CustomCard from "@/components/CustomCard";

// Utilities
import { mount, createLocalVue } from "@vue/test-utils";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("CustomCard.vue", () => {
  const vuetify = new Vuetify();

  it("should have a custom title and match snapshot", () => {
    const wrapper = mount(CustomCard, {
      localVue,
      vuetify,
      propsData: {
        title: "Foobar"
      }
    });

    expect(wrapper.html()).toMatchSnapshot();

    const title = wrapper.find(".v-card__title > span");
    expect(title.text()).toBe("Foobar");
  });

  it("should emit an event when the action v-btn is clicked", () => {
    const wrapper = mount(CustomCard, {
      localVue,
      vuetify
    });

    const event = jest.fn();
    const button = wrapper.find(".v-btn");

    // https://vuejs.org/v2/api/#Instance-Methods-Events
    wrapper.vm.$on("action-btn:clicked", event);

    expect(event).toHaveBeenCalledTimes(0);

    // Simulate a click on the button
    button.trigger("click");

    // Ensure that our mock event was called
    expect(event).toHaveBeenCalledTimes(1);
  });
});
