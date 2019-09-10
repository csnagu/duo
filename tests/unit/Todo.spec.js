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

describe("ストップウォッチのボタンが機能するか", () => {
  const vuetify = new Vuetify();
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Todo, {
      localVue,
      vuetify
    });
    wrapper.find("#addTaskBtn").trigger("click");
  });

  it("ページにアクセスしたときの時間は、0が表示されていること", () => {
    const workTime = Number(wrapper.find(".workTime").text());
    expect(workTime).toEqual(0);
  });

  it("ストップウォッチボタンを一度クリックすると、時間が増加すること", () => {
    wrapper.find(".timerBtn").trigger("click");
    const workTime = Number(wrapper.find(".workTime").text());
    console.log(workTime);
    expect(workTime).toBeGreaterThan(0);
  });

  it("ストップウォッチボタンを二度クリックすると、カウントが停止されること", () => {
    wrapper.find(".timerBtn").trigger("click");
    wrapper.find(".timerBtn").trigger("click");

    const workTime = Number(wrapper.find(".workTime").text());
    expect(workTime).toBeGreaterThan(0);

    // 1秒後に.work-timeが変化していないことを確認する
    setTimeout(
      expect(workTime).toEqual(Number(wrapper.find(".workTime").text())),
      1000
    );
  });

  it("ストップウォッチを再開すると、停止した時間から計測が再開すること", () => {
    wrapper.find(".timerBtn").trigger("click");
    setTimeout(wrapper.find(".timerBtn").trigger("click"), 2000);

    const workTime = Number(wrapper.find(".workTime").text());
    wrapper.find(".timerBtn").trigger("click");
    expect(Number(wrapper.find(".workTime").text())).toBeGreaterThan(workTime);
  });
});
