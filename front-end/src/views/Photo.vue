<template>
  <div class="photo-page">
    <div class="photo">
      <div class="photo-child">
        <img :src="photo.path" />
      </div>
      <div class="photo-child">
        <h1>Title: {{ photo.title }}</h1>
        <h1>By: {{ photo.user.firstName }} {{ photo.user.lastName }}</h1>
        <h1>Description: {{ photo.description }}</h1>
        <h1>Uploaded {{ formatDate(photo.created) }}</h1>
      </div>
    </div>
    <h1>COMMENTS:</h1>
    <div class="comments">
      <div class="comment" v-for="comment in comments" :key="comment._id">
        <p>{{ comment.comment }}</p>
        <pre>
-{{ comment.user.firstName }} {{ comment.user.lastName }}          Added: {{
            formatDate(comment.created)
          }}</pre
        >
      </div>
    </div>
    <div v-if="userLogin">
      <h1>Add a Review:</h1>
      <div class="comment-form">
        <textarea v-model="comment" placeholder="Put your comments here"/>
        <button @click="addComment()">Add Review</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Photo",
  data() {
    return {
      photo: Object,
      comment: "",
      comments: [],
    };
  },
  created() {
    this.getPhoto();
    this.getComments();
    this.getUser();
  },
  computed: {
    userLogin() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async getPhoto() {
      try {
        let response = await axios.get(
          "/api/photos/photo/" + this.$route.params.id
        );
        this.photo = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
    async addComment() {
      try {
        await axios.post("/api/comments/" + this.$route.params.id, {
          comment: this.comment,
        });
        this.comment = "";
        this.getComments();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getComments() {
      try {
        let response = await axios.get(
          "/api/comments/" + this.$route.params.id
        );
        this.comments = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getUser() {
      try {
        let response = await axios.get("/api/users");
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  },
};
</script>

<style scoped>
.photo {
  display: flex;
}
.photo img {
  margin-top: 50px;
  width: 100%;
}
.photo-child {
  width: 50%;
}

.photo-child h1 {
  color: black;
  margin: 100px;
}
.photo-page h1 {
  color: black;
}
pre {
  font-size: medium;
  color: grey;
}
.comment {
  margin-bottom: 40px;
}
.comment-form {
  display: flex;
}
.comment-form textarea {
  max-width: 50%;
}
.comment-form button {
  max-height: 25px;
  margin-left: 1em;
}
</style>
