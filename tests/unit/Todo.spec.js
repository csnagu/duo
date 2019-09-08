// Libraries
import Vue from "vue";
import Vuetify from "vuetify";

// Components
import Todo from "@/components/Todo";

// Utilities
import { createLocalVue, mount } from "@vue/test-utils";

const localVue = createLocalVue();
Vue.use(Vuetify);

describe("Todoの各ボタンが機能するか", () => {
  const vuetify = new Vuetify();
  let initData;
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Todo, {
      localVue,
      vuetify
    });

    initData = [
      {
        id: 0,
        item: "data1",
        done: false
      },
      {
        id: 1,
        item: "data2",
        done: false
      }
    ];
  });

  it("タスク追加アイコンをクリックすると、taskが1件追加されること", () => {
    expect(wrapper.vm.tasks.length).toEqual(0);

    wrapper.find("#addTaskBtn").trigger("click");
    expect(wrapper.vm.tasks.length).toEqual(1);
  });

  it("タスク削除アイコンをクリックすると、当該のタスクが削除されること", () => {
    wrapper.vm.tasks = initData;
    const expectData = [
      {
        id: 1,
        item: "data2",
        done: false
      }
    ];

    wrapper.find(".removeTaskBtn").trigger("click");
    expect(wrapper.vm.tasks).toEqual(expectData);
  });

  it("タスク完了アイコンをクリックすると、当該タスクのDoneがtrueになること", () => {
    wrapper.vm.tasks = initData;
    const expectData = [
      {
        id: 0,
        item: "data1",
        done: true
      },
      {
        id: 1,
        item: "data2",
        done: false
      }
    ];

    wrapper.find(".doneTaskBtn").trigger("click");
    expect(wrapper.vm.tasks).toEqual(expectData);
  });
});
