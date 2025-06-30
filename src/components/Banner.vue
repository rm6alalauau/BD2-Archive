<template>
  <div>
    <v-alert
      :value="visible"
      :type="type"
      :icon="icon"
      :color="color"
      density="compact"
      close-label="Close"
      rounded="lg"
      @input="updateVisible"
      closable
    >
      <v-row>
        <v-col class="d-flex align-center">
          <span>{{ message }}</span>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <a :href="url" @click.prevent="viewDetails" style="color: inherit"
            >查看詳情</a
          >
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "info", // 'info', 'warning', 'error'
    },
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: "#",
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case "warning":
          return "mdi-alert-circle-outline";
        case "error":
          return "mdi-alert-circle-outline";
        default:
          return "";
      }
    },
    color() {
      switch (this.type) {
        case "warning":
          return "#FFD200";
        case "error":
          return "#B9221C";
        default:
          return "#365405";
      }
    },
  },
  methods: {
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
    viewDetails() {
      window.open(this.url, '_blank');
    },
  },
};
</script>
