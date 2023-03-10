<template>
  <div class="output-wrapper">
    <div class="output-header">
      <div class="tab-buttons">
        <button
          v-for="(m, index) of outputModes"
          :class="{ active: mode === m }"
          @click="mode = m"
          :key="index"
        >
          <span>{{ m }}</span>
        </button>
      </div>
      <div class="toolbar-navs">
        <button class="item" @click="changeShowCodeState" v-if="isVertical">
          <Icon icon="ic:round-code-off" class="vcv-icon" v-if="isShowCode" />
          <Icon icon="ic:round-code" class="vcv-icon" v-if="!isShowCode" />
        </button>
        <!-- <button class="item">
          <Icon icon="radix-icons:transparency-grid" class="vcv-icon" />
        </button> -->

        <!-- docker side -->
        <Dropdown class="item" @command="changeDockTo">
          <span class="dropdown-btn">
            <Icon :icon="dockSides[dockSide]" class="vcv-icon" />
            <span class="more-text"> {{ dockSide }} </span>
            <!-- <Icon icon="ic:round-keyboard-arrow-down" class="vcv-icon" /> -->
          </span>
          <DropdownMenu slot="dropdown">
            <DropdownItem
              v-for="(_, index) in dockSides"
              :icon="_"
              :key="index"
              :value="index"
              :command="index"
            >
              {{ index }}
              <Icon
                icon="carbon:checkmark"
                width="13"
                height="13"
                style="margin-left: 6px"
                v-if="index === dockSide"
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!-- 设备模拟 -->
        <Dropdown v-if="showDeviceSize" class="item" @command="changeDeviceSizes">
          <span class="dropdown-btn">
            <Icon icon="ic:round-devices" class="vcv-icon" />
            <span class="more-text"> {{ deviceSizeSeleted }} </span>
            <Icon icon="ic:round-keyboard-arrow-down" class="vcv-icon" />
          </span>
          <DropdownMenu slot="dropdown">
            <DropdownItem
              v-for="(_, index) in deviceSizes"
              :key="index"
              :value="index"
              :command="index"
            >
              {{ index }}
              <Icon
                icon="carbon:checkmark"
                width="13"
                height="13"
                style="margin-left: 6px"
                v-if="index === deviceSizeSeleted"
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <div class="output-container" :class="{ 'padding-32': !enabled }">
      <!-- <Preview :show="mode === 'preview'" v-if="mode === 'preview'" /> -->
      <!-- -->
      <!-- <OutputContainer :code="sourceCode"></OutputContainer> -->
      <!-- 设备仿真 -->
      <DeviceEmulation
        :width="deviceWidth"
        :height="deviceHeight"
        :disable-scaling="enabled"
      >
        <OutputContainer :code="sourceCode"></OutputContainer>
      </DeviceEmulation>
    </div>
  </div>
</template>
<script>
import { Icon } from "@iconify/vue2";
import Preview from "./Preview.vue";
import sizes from "../settings/screen-sizes.json";
import OutputContainer from "../code-viewer/output-container.vue";
import Dropdown from "../dropdown/Dropdown.vue";
import DropdownMenu from "../dropdown/DropdownMenu.vue";
import DropdownItem from "../dropdown/DropdownItem.vue";
import DeviceEmulation from "../vcv/DeviceEmulation.vue";
import "../dropdown/dropdown.css";

export default {
  inject: [
    "vcv",
    // "handleShowCode",
    "handleChangeTransparent",
    // "showCode",
    "code",
  ],
  components: {
    // Preview,
    Icon,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    OutputContainer,
    DeviceEmulation,
  },
  props: {
    sourceCode: { type: String },
    showDeviceSize: { type: Boolean, default: false}
  },
  data() {
    return {
      outputModes: ["preview"], //"preview", "css"
      mode: "preview",

      dockSides: {
        top: "mdi:dock-top",
        right: "mdi:dock-right",
        left: "mdi:dock-left",
      },
      dockSide: this.vcv.layoutName, // 默认"top",

      isShowCode: this.vcv.showCodeEditor,

      deviceSizes: sizes,
      deviceSizeSeleted: "Default",
    };
  },
  created() {
    console.log("output created", this.vcv.layoutName);
  },
  methods: {
    changeDockTo(cmd) {
      this.dockSide = cmd;
      this.$emit("dock", this.dockSide);
    },

    changeShowCodeState() {
      this.isShowCode = !this.isShowCode;
      this.$emit("codeshow", this.isShowCode);
    },
    changeDeviceSizes(cmd) {
      this.deviceSizeSeleted = cmd;
      console.log("changeDeviceSizes", this.deviceWidth, this.deviceHeight);
    },
  },
  computed: {
    isVertical() {
      return this.dockSide === "top";
    },
    enabled() {
      return this.deviceSizeSeleted === "Default";
    },
    deviceWidth() {
      return this.deviceSizes[this.deviceSizeSeleted][0];
    },
    deviceHeight() {
      return this.deviceSizes[this.deviceSizeSeleted][1];
    },
  },
  watch: {
    "vcv.layoutName": {
      immediate: true,
      handler(val) {
        this.dockSide = val;
      },
    },
  },
};
</script>
<style scoped>
button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}

.output-wrapper {
  height: 100%;
  position: relative;
}
.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  height: var(--header-height);
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.tab-buttons button {
  padding: 0;
  box-sizing: border-box;
}
.tab-buttons span {
  font-size: 13px;
  font-family: var(--font-code);
  text-transform: uppercase;
  color: var(--text-light);
  display: inline-block;
  padding: 5px 16px 4px;
  line-height: 20px;
}
button.active {
  color: var(--color-branding-dark);
  border-bottom: 3px solid var(--color-branding-dark);
}

.toolbar-navs {
  padding-left: 30px;
  flex: 0 1 auto;
  overflow: hidden;
}

.toolbar-navs .item {
  padding: 6px 8px 6px;
  border-left: 1px solid var(--border);
}

.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
  background-color: var(--bg-device);
}

/* dropdown-btn 文字样式 */
.dropdown-btn {
  display: flex;
  align-items: center;
}
.dropdown-btn span {
  font-size: 13px;
  line-height: 20px;
  margin: 0 2px 0 6px;
  font-family: var(--font-code);
  text-transform: uppercase;
  color: var(--text-light);
  max-width: 80px;
}

span.more-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.padding-32 {
  padding: 32px;
}
</style>
