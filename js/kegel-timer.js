// ============================================================
// KEGEL-TIMER.JS - Bộ đếm thời gian luyện Kegel
// ============================================================

const KegelTimer = {
  state: 'idle', // idle | contracting | releasing | resting | done
  currentRep: 0,
  totalReps: 0,
  interval: null,
  timeLeft: 0,
  program: null,
  onUpdate: null,

  PROGRAMS: {
    beginner: {
      name: 'Người mới bắt đầu',
      description: 'Siết 3s, thả 6s - 10 hiệp',
      contractTime: 3,
      releaseTime: 6,
      reps: 10,
      sets: 3,
      restBetweenSets: 60,
      color: '#4ade80'
    },
    intermediate: {
      name: 'Trung cấp',
      description: 'Siết 5s, thả 10s - 15 hiệp',
      contractTime: 5,
      releaseTime: 10,
      reps: 15,
      sets: 3,
      restBetweenSets: 45,
      color: '#60a5fa'
    },
    advanced: {
      name: 'Nâng cao',
      description: 'Siết 10s, thả 5s - 20 hiệp',
      contractTime: 10,
      releaseTime: 5,
      reps: 20,
      sets: 4,
      restBetweenSets: 30,
      color: '#f472b6'
    },
    reverse: {
      name: 'Reverse Kegel',
      description: 'Thả lỏng sâu 8s, hồi phục 4s - 10 hiệp',
      contractTime: 0,
      releaseTime: 8,
      recoveryTime: 4,
      reps: 10,
      sets: 2,
      restBetweenSets: 60,
      color: '#a78bfa',
      isReverse: true
    }
  },

  start(programKey, onUpdate) {
    this.program = this.PROGRAMS[programKey];
    this.onUpdate = onUpdate;
    this.currentRep = 0;
    this.currentSet = 1;
    this.state = 'idle';
    this.totalReps = this.program.reps * this.program.sets;

    if (programKey === 'reverse') {
      this.runReverse();
    } else {
      this.runContract();
    }
  },

  runContract() {
    this.state = 'contracting';
    this.timeLeft = this.program.contractTime;
    this.tick();
  },

  runRelease() {
    this.state = 'releasing';
    this.timeLeft = this.program.releaseTime;
    this.tick();
  },

  runRest() {
    this.state = 'resting';
    this.timeLeft = this.program.restBetweenSets;
    this.tick();
  },

  runReverse() {
    this.state = 'releasing';
    this.timeLeft = this.program.releaseTime;
    this.tick();
  },

  tick() {
    clearInterval(this.interval);
    this.notify();
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.notify();

      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        this.nextStep();
      }
    }, 1000);
  },

  nextStep() {
    if (this.state === 'contracting') {
      this.runRelease();
    } else if (this.state === 'releasing') {
      this.currentRep++;

      if (this.currentRep >= this.program.reps) {
        if (this.currentSet < this.program.sets) {
          this.currentSet++;
          this.currentRep = 0;
          this.runRest();
        } else {
          this.finish();
        }
      } else {
        if (this.program.isReverse) {
          this.state = 'recovering';
          this.timeLeft = this.program.recoveryTime || 4;
          this.tick();
        } else {
          this.runContract();
        }
      }
    } else if (this.state === 'resting') {
      if (this.program.isReverse) {
        this.runReverse();
      } else {
        this.runContract();
      }
    } else if (this.state === 'recovering') {
      this.runReverse();
    }
  },

  finish() {
    this.state = 'done';
    this.notify();
    Storage.addKegelSession(Math.round((this.program.contractTime + this.program.releaseTime) * this.program.reps * this.program.sets / 60));
  },

  stop() {
    clearInterval(this.interval);
    this.state = 'idle';
    this.notify();
  },

  notify() {
    if (this.onUpdate) this.onUpdate({
      state: this.state,
      timeLeft: this.timeLeft,
      rep: this.currentRep,
      set: this.currentSet,
      totalReps: this.program ? this.program.reps : 0,
      totalSets: this.program ? this.program.sets : 0,
      program: this.program,
      progress: this.program ? (this.currentRep / this.program.reps) : 0
    });

    // Haptic feedback
    if (navigator.vibrate) {
      if (this.state === 'contracting') navigator.vibrate([100, 50, 100]);
      else if (this.state === 'releasing') navigator.vibrate(50);
      else if (this.state === 'resting') navigator.vibrate([200, 100, 200]);
    }
  }
};
