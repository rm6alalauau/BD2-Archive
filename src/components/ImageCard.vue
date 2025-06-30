<template>
  <v-row justify="end">
    <v-col>
      <v-card rounded="xl">
        <v-card-title
          class="headline"
          style="font-size: 1rem; font-weight: bold"
        >
          {{ category }}
        </v-card-title>
        <div
          style="
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: thin;
            scrollbar-color: #5c8a10 #000000;
          "
        >
          <div
            v-for="(image, i) in filteredList"
            :key="i"
            class="d-inline-block mx-2 text-center"
          >
            <v-img
              :src="image.url"
              height="100"
              width="100"
              class="d-block mx-auto"
            ></v-img>
            <div>{{ image.name }}</div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import jsonData from "@/assets/img.json";

export default {
  name: "ImageCard",
  props: {
    category: {
      type: String,
      required: true,
    },
    filterBy: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      json: jsonData,
      baseUrl: "https://pub-0d4bc7637d714b47b1b7ccc2de0275e1.r2.dev/",
    };
  },
  computed: {
    filteredList() {
      const categoryData = this.json[this.category];

      if (!categoryData) return [];

      let allImages = [];

      if (Array.isArray(categoryData)) {
        // Handle array structure
        for (const item of categoryData) {
          if (item.img) {
            allImages.push(
              ...item.img.map((img) => ({
                url: `${this.baseUrl}${this.category}/${item.name}/${img}.webp`,
                name: img,
              }))
            );
          }
        }
      } else if (categoryData.img) {
        // Handle direct img array structure
        allImages = categoryData.img.map((img) => ({
          url: `${this.baseUrl}${this.category}/${img}.webp`,
          name: img,
        }));
      } else {
        // Handle nested object structure
        for (const key in categoryData) {
          if (categoryData[key].img) {
            allImages.push(
              ...categoryData[key].img.map((img) => ({
                url: `${this.baseUrl}${this.category}/${key}/${img}.webp`,
                name: img,
              }))
            );
          }
        }
      }

      // Apply filtering if filterBy is provided
      if (this.filterBy) {
        const regex = new RegExp(this.filterBy, "i");
        return allImages.filter((image) => regex.test(image.url));
      }

      return allImages;
    },
  },
};
</script>
