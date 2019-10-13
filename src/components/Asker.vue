<template>
  <v-card>
    <v-card-title>Engish to Chinese</v-card-title>
    <v-card-text>
      <p class="display-1 text--primary">
        Word: "{{this.word.english}}"
      </p>
      <p v-if="this.state == 'answer'">
        {{this.word.pinyin}} ({{this.word.chinese}})
      </p>
    </v-card-text>
    <div v-if="this.state == 'question'">
      <v-card-actions>
        <v-text-field dense height=28 v-model="answer" />
        <v-spacer></v-spacer>
        <v-btn @click="onSubmit(answer)">Submit</v-btn>
        <v-btn @click="next(0)">Skip</v-btn>
      </v-card-actions>
    </div>
    <div v-if="this.state == 'answer'">
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="next(score)">Next</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ['word', 'next'],
  data: () => ({
    answer: '',
    state: 'question',
    score: 0,
  }),
  mounted() {
    window.addEventListener('keydown', this.enterSubmit);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.enterSubmit);
  },
  methods: {
    enterSubmit: function(event) {
      if (event.key != 'Enter') {
        return
      }
      if (this.state == 'question') {
        this.onSubmit(this.answer)
      } else {
        this.next(this.score)
      }
    },
    onSubmit: function(answer) {
      this.process_answer(answer);
      this.answer = '';
      this.state = 'answer'
    },
    remove_accent: function(word) {
      if (word) {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      }
    },
    process_answer: function(answer) {
      // Add lowercase
      console.log('process_answer...', answer)
      let score = 0;
      if (answer === false) { // skip
        score = 0
      } if (answer === this.word.pinyin) {
        score = 2
      } else if (this.remove_accent(answer) == this.remove_accent(this.word.pinyin)) {
        score = 1
      } else if (answer == this.word.chinese) {
        score = 1
      } else {
        score = -1;
      }
      this.score = score;
    },
  }
};
</script>
