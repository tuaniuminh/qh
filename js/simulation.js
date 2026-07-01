// ============================================================
// SIMULATION.JS - Engine mô phỏng thực hành
// Toàn bộ quá trình từ đầu đến cuối với hướng dẫn thời gian thực
// ============================================================

const Simulation = {

  // Trạng thái hiện tại
  active: false,
  paused: false,
  startTime: null,
  elapsedSeconds: 0,
  arousalLevel: 0,      // 0-10
  interval: null,
  currentPhaseIndex: 0,
  currentStepIndex: 0,
  sessionLog: [],
  onUpdate: null,

  // Thang đo hưng phấn
  AROUSAL_COLORS: {
    0: '#4ade80', 1: '#4ade80', 2: '#86efac',
    3: '#a3e635', 4: '#facc15',
    5: '#fb923c', 6: '#f97316',
    7: '#ef4444', 8: '#dc2626',
    9: '#991b1b', 10: '#7f1d1d'
  },

  AROUSAL_LABELS: [
    'Bình thường', 'Kích thích nhẹ', 'Hơi hưng phấn',
    'Khởi động tốt', 'Đang vào guồng', 'Hưng phấn trung bình',
    'Đang tăng cao', '⚠️ NGƯỠNG KIỂM SOÁT', 'Nguy hiểm!',
    'Gần đỉnh!', '🚨 ĐIỂM KHÔNG THỂ DỪNG'
  ],

  // CÁC GIAI ĐOẠN MÔ PHỎNG CHI TIẾT
  PHASES: [
    {
      id: 'warmup',
      name: 'Giai đoạn 1: Khởi động & Kết nối',
      duration: 180, // 3 phút
      targetArousal: [1, 3],
      bgGradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      color: '#4ade80',
      icon: '🌱',
      steps: [
        {
          time: 0,
          arousal: 1,
          title: 'Bắt đầu - Tiếp xúc nhẹ nhàng',
          instruction: 'Hãy thở đều, cơ thể thư giãn hoàn toàn. Tập trung vào cảm giác chứ không phải kết quả. Hưng phấn của bạn đang ở mức 1/10 - đây là trạng thái lý tưởng để bắt đầu.',
          tip: '💡 Mẹo: Giữ hơi thở bụng sâu và chậm từ đầu sẽ giúp bạn kiểm soát tốt hơn sau này.',
          pcAction: null,
          partnerTip: null
        },
        {
          time: 45,
          arousal: 2,
          title: 'Tiền희 희 희 희희 - Xây dựng kết nối',
          instruction: 'Hưng phấn tăng lên 2/10. Hãy chú ý đến nhịp thở của bạn - thở bằng bụng, không thở ngực. Cơ PC đang thư giãn - tốt! Đừng siết cơ PC lúc này.',
          tip: '💡 Thở bụng: Hít vào → bụng phình ra → thở ra → bụng xẹp xuống.',
          pcAction: 'relax',
          partnerTip: null
        },
        {
          time: 90,
          arousal: 2.5,
          title: 'Duy trì nhịp chậm',
          instruction: 'Giữ nhịp di chuyển chậm và đều. Hưng phấn ở 2.5/10 - vẫn còn rất thoải mái. Thư giãn cơ PC hoàn toàn. Đây là lúc cơ thể "nóng máy" đúng cách.',
          tip: '💡 Kỹ thuật 9-1: Di chuyển 9 cú nông + 1 cú sâu, lặp lại. Giúp kiểm soát dễ hơn.',
          pcAction: 'relax',
          partnerTip: '💑 Tương tác: Nói chuyện nhẹ nhàng, nhìn vào mắt, tạo kết nối cảm xúc.'
        },
        {
          time: 150,
          arousal: 3,
          title: 'Khởi động hoàn tất',
          instruction: 'Tuyệt vời! Hưng phấn 3/10, bạn đã vào guồng. Nhịp thở vẫn đều đặn? Cơ toàn thân vẫn thư giãn? Nếu có, bạn đang thực hiện đúng.',
          tip: '💡 Kiểm tra: Vai bạn có đang căng không? Hàm có đang nghiến không? Hãy chủ động thả lỏng.',
          pcAction: 'relax',
          partnerTip: null
        }
      ]
    },
    {
      id: 'buildup',
      name: 'Giai đoạn 2: Tăng cường - Theo dõi cẩn thận',
      duration: 240,
      targetArousal: [3, 6],
      bgGradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      color: '#60a5fa',
      icon: '📈',
      steps: [
        {
          time: 0,
          arousal: 3.5,
          title: 'Tăng nhịp - Vào giai đoạn 2',
          instruction: 'Bắt đầu tăng nhịp lên một chút. Hưng phấn sẽ tăng theo - đây là điều bình thường. Nhiệm vụ của bạn: THEO DÕI liên tục, không để hưng phấn vượt 7/10 mà không được chuẩn bị.',
          tip: '💡 Bắt đầu áp dụng Kegel nhẹ: Siết nhẹ cơ PC 2-3 giây, thả ra 5 giây. Làm đều đặn.',
          pcAction: 'light_kegel',
          partnerTip: '💑 Tương tác: Thay đổi góc độ hoặc vị trí để tăng sự đa dạng.'
        },
        {
          time: 60,
          arousal: 4.5,
          title: 'Hưng phấn 4.5/10 - Tiếp tục theo dõi',
          instruction: 'Cảm giác đang rất tốt. Hưng phấn ở 4.5/10. Hãy nhớ: MỤC TIÊU không phải là kiềm chế hoàn toàn, mà là NHẬN BIẾT và KIỂM SOÁT từng bước.',
          tip: '💡 Kỹ thuật đếm: Đếm nhịp thở hoặc đếm các cú di chuyển. Giúp não tập trung ra ngoài cảm giác.',
          pcAction: 'light_kegel',
          partnerTip: null
        },
        {
          time: 120,
          arousal: 5.5,
          title: '⚡ Hưng phấn 5.5/10 - Tăng cảnh giác',
          instruction: 'Hưng phấn đang tăng đáng kể! Đây là lúc cần tập trung cao độ. Nhịp thở vẫn đều? Cơ PC vẫn thả lỏng giữa các lần siết? Hãy chuẩn bị tâm thế cho giai đoạn kiểm soát sắp tới.',
          tip: '💡 Báo hiệu sớm: Nếu thấy hưng phấn tăng nhanh bất thường, hãy ngay lập tức giảm nhịp.',
          pcAction: 'moderate_kegel',
          partnerTip: '💑 Tương tác: Chuyển sang kỹ thuật nông hoặc thay đổi góc độ để kiếm soát nhịp.'
        },
        {
          time: 180,
          arousal: 6.5,
          title: '🔥 Hưng phấn 6.5/10 - SẮP ĐẾN NGƯỠNG',
          instruction: 'CẢNH BÁO: Hưng phấn đang tiếp cận ngưỡng 7/10. Ngay bây giờ hãy: 1) Giảm nhịp xuống tốc độ tối thiểu, 2) Hít thở sâu bụng, 3) Chuẩn bị siết cơ PC mạnh.',
          tip: '💡 Không được hoảng loạn! Hoảng loạn sẽ làm hưng phấn tăng nhanh hơn. Thở đều, di chuyển chậm.',
          pcAction: 'strong_kegel',
          partnerTip: null
        }
      ]
    },
    {
      id: 'control',
      name: 'Giai đoạn 3: Kiểm soát - Ngưỡng 7/10',
      duration: 120,
      targetArousal: [6.5, 8],
      bgGradient: 'linear-gradient(135deg, #450a0a, #7f1d1d, #991b1b)',
      color: '#ef4444',
      icon: '🛡️',
      steps: [
        {
          time: 0,
          arousal: 7,
          title: '🚨 NGƯỠNG 7/10 - KÍCH HOẠT KIỂM SOÁT',
          instruction: 'DỪNG DI CHUYỂN NGAY! Hưng phấn đã chạm 7/10. Đây là thời điểm quan trọng nhất. Thực hiện NGAY: Siết cơ PC mạnh và giữ trong 5-8 giây. Không thở nín, hãy thở ra từ từ.',
          tip: '🛡️ Kỹ thuật siết PC: Tưởng tượng bạn đang nín tiểu gấp → siết mạnh → giữ 5-8 giây → thả từ từ.',
          pcAction: 'emergency_kegel',
          partnerTip: '💑 QUAN TRỌNG: Chuyển sang hôn sâu, massage, vuốt ve để đối tác không bị tụt hứng trong lúc bạn dừng.'
        },
        {
          time: 20,
          arousal: 7.5,
          title: '⏳ Giữ siết PC - Đếm ngược',
          instruction: 'TIẾP TỤC siết PC. Hưng phấn đang ở đỉnh - đây là thời điểm cơ PC làm việc. Đếm ngược: 5...4...3...2...1... Siết mạnh và đều. Đừng bỏ cuộc!',
          tip: '🛡️ Nếu siết PC đúng: Bạn sẽ cảm thấy hưng phấn "đóng băng" hoặc giảm nhẹ sau 5-8 giây.',
          pcAction: 'hold_kegel',
          partnerTip: '💑 Tiếp tục: Hôn, nói nhẹ, thì thầm để duy trì không khí.'
        },
        {
          time: 45,
          arousal: 7,
          title: '📉 Hưng phấn bắt đầu hạ - Thả cơ PC',
          instruction: 'Tốt lắm! Hưng phấn đang hạ về 7/10. Bây giờ hãy THẢ cơ PC từ từ trong 5 giây. Tiếp theo: áp dụng Reverse Kegel để đẩy hưng phấn xuống nhanh hơn.',
          tip: '💡 Thả cơ PC ĐÚNG cách: Thả từ từ, không đột ngột. Cảm nhận cơ PC mở rộng ra.',
          pcAction: 'release',
          partnerTip: '💑 Bây giờ: Chủ động vuốt ve lưng, vai, đùi đối tác - duy trì nhiệt tình.'
        },
        {
          time: 70,
          arousal: 6,
          title: '✅ Kiểm soát thành công!',
          instruction: 'XUẤT SẮC! Bạn đã kiểm soát thành công ngưỡng 7/10. Hưng phấn đã hạ về 6/10. Bây giờ chuyển sang giai đoạn Reverse Kegel để hạ tiếp.',
          tip: '🏆 Ghi nhớ: Mỗi lần bạn vượt qua ngưỡng 7/10 thành công, não bạn sẽ ghi nhớ và lần sau dễ hơn.',
          pcAction: null,
          partnerTip: null
        }
      ]
    },
    {
      id: 'reverse',
      name: 'Giai đoạn 4: Reverse Kegel - Hạ hưng phấn',
      duration: 90,
      targetArousal: [5, 7],
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)',
      color: '#a78bfa',
      icon: '🌊',
      steps: [
        {
          time: 0,
          arousal: 6,
          title: '🌊 Bắt đầu Reverse Kegel',
          instruction: 'Reverse Kegel = Thả lỏng cơ PC chủ động và sâu. Hít vào bụng thật sâu → khi thở ra, "đẩy" nhẹ xuống như đang đi vệ sinh → giữ 3-5 giây → hít vào bình thường. Lặp lại 5-8 lần.',
          tip: '🌊 Cảm giác đúng: Vùng bụng dưới và tầng sinh môn căng ra và thư giãn. Hưng phấn sẽ giảm rõ rệt.',
          pcAction: 'reverse_kegel',
          partnerTip: '💑 Trong lúc Reverse Kegel: Hãy hôn cổ, tai, tạm dừng di chuyển nhưng vẫn giao tiếp thân mật.'
        },
        {
          time: 30,
          arousal: 5,
          title: '📉 Hưng phấn hạ về 5/10',
          instruction: 'Hưng phấn đang hạ tốt! Tiếp tục Reverse Kegel. Kết hợp với: Thở bụng sâu + Thư giãn vai và hàm + Suy nghĩ đến điều gì đó trung tính. Hưng phấn sẽ tiếp tục giảm.',
          tip: '💡 Kỹ thuật tư duy: Tập trung vào việc cảm nhận da thịt đối tác thay vì kích thích trực tiếp.',
          pcAction: 'reverse_kegel',
          partnerTip: '💑 Tạo kết nối: Nói điều gì đó dịu dàng. "Em có ổn không?" tạo sự kết nối mà không làm gián đoạn.'
        },
        {
          time: 60,
          arousal: 4,
          title: '✅ Hưng phấn về 4/10 - An toàn',
          instruction: 'Hoàn hảo! Hưng phấn đã hạ về 4/10. Cơ thể đã "reset" thành công. Bạn có thể bắt đầu lại chu kỳ tiếp theo với tốc độ chậm.',
          tip: '🏆 Mỗi chu kỳ kiểm soát thành công = Cải thiện 10-15% khả năng kiểm soát vĩnh viễn.',
          pcAction: 'relax',
          partnerTip: '💑 Đây là lúc tuyệt vời để thay đổi tư thế hoặc vị trí - tạo sự đa dạng và giữ hứng cho đối tác.'
        }
      ]
    },
    {
      id: 'cycle2',
      name: 'Giai đoạn 5: Chu kỳ 2 - Tăng thời gian',
      duration: 300,
      targetArousal: [4, 7],
      bgGradient: 'linear-gradient(135deg, #0d2137, #1a4a6e, #1e6091)',
      color: '#38bdf8',
      icon: '🔄',
      steps: [
        {
          time: 0,
          arousal: 4,
          title: '🔄 Chu kỳ 2 bắt đầu',
          instruction: 'Xuất sắc! Bạn đã hoàn thành chu kỳ đầu tiên. Hưng phấn đang ở 4/10 - đây là điểm an toàn. Bắt đầu lại nhưng lần này có thể tự tin hơn vì não đã nhớ cách kiểm soát.',
          tip: '💡 Chu kỳ 2 sẽ dễ kiểm soát hơn chu kỳ 1 vì não đã học được phản xạ.',
          pcAction: 'light_kegel',
          partnerTip: '💑 Thay đổi tư thế để tạo cảm giác mới mẻ - giúp đối tác luôn hứng khởi.'
        },
        {
          time: 90,
          arousal: 5.5,
          title: 'Tăng dần - Chu kỳ 2',
          instruction: 'Hưng phấn 5.5/10. Lần này bạn biết cảm giác ở 7/10 là như thế nào, nên hãy chuẩn bị TRƯỚC khi đến đó. Bắt đầu Kegel nhẹ từ bây giờ.',
          tip: '💡 Chiến lược: Lần này hãy chủ động dừng ở 6.5/10 thay vì đợi đến 7/10.',
          pcAction: 'moderate_kegel',
          partnerTip: null
        },
        {
          time: 180,
          arousal: 6.5,
          title: '⚡ Tiếp cận ngưỡng - Lần 2',
          instruction: 'Hưng phấn 6.5/10 - lần này hãy CHỦ ĐỘNG kiểm soát TRƯỚC khi đến 7/10. Giảm nhịp ngay bây giờ và siết cơ PC vừa phải.',
          tip: '🏆 Đây là kỹ năng cốt lõi: Kiểm soát chủ động thay vì phản ứng bị động.',
          pcAction: 'strong_kegel',
          partnerTip: '💑 Thay đổi nhịp: Chuyển sang di chuyển nông và chậm để cùng nhau thư giãn.'
        },
        {
          time: 240,
          arousal: 5,
          title: '✅ Kiểm soát chu kỳ 2 thành công',
          instruction: 'Tuyệt vời! Lần này bạn kiểm soát CHỦ ĐỘNG hơn. Đây là tiến bộ thực sự. Hưng phấn về 5/10. Bạn có thể tiếp tục thêm chu kỳ nữa hoặc tiến đến giai đoạn cuối.',
          tip: '🏆 Mục tiêu dài hạn: Duy trì được 3-5 chu kỳ trong 1 buổi = xuất tinh sớm đã được kiểm soát hoàn toàn.',
          pcAction: null,
          partnerTip: null
        }
      ]
    },
    {
      id: 'finale',
      name: 'Giai đoạn 6: Kết thúc có kiểm soát',
      duration: 120,
      targetArousal: [5, 10],
      bgGradient: 'linear-gradient(135deg, #1f0533, #4a044e, #7b2f9e)',
      color: '#d946ef',
      icon: '🎯',
      steps: [
        {
          time: 0,
          arousal: 6,
          title: '🎯 Giai đoạn kết thúc - Bạn quyết định',
          instruction: 'Đây là giai đoạn cuối. Bạn đã kiểm soát thành công nhiều chu kỳ. Bây giờ bạn có thể lựa chọn: (1) Tiến đến kết thúc có kiểm soát, hoặc (2) Thêm một chu kỳ nữa để rèn luyện.',
          tip: '💡 Kết thúc có kiểm soát = Bạn CHỌN khi nào chứ không phải bị ép buộc. Đây là định nghĩa của kiểm soát thực sự.',
          pcAction: null,
          partnerTip: '💑 Giao tiếp: Hỏi đối tác họ muốn gì - sự giao tiếp tạo nên trải nghiệm tuyệt vời.'
        },
        {
          time: 60,
          arousal: 8,
          title: '🌋 Tăng cường cuối',
          instruction: 'Hưng phấn tăng lên 8/10. Lần này hãy để nó tăng trong khi vẫn kiểm soát nhịp thở và cơ PC. Cảm nhận sự khác biệt: Bạn CHỌN để tăng thay vì bị cuốn đi.',
          tip: '🎯 Đây là sự khác biệt giữa người kiểm soát và người bị kiểm soát.',
          pcAction: 'controlled_release',
          partnerTip: '💑 Đây là lúc tập trung vào đối tác hoàn toàn - quan sát và đáp ứng phản ứng của họ.'
        },
        {
          time: 100,
          arousal: 10,
          title: '🏆 Kết thúc xuất sắc!',
          instruction: 'Bạn đã hoàn thành buổi thực hành! Đây là kết thúc có kiểm soát - bạn đã quyết định khi nào và như thế nào. Đây là mục tiêu cuối cùng của việc rèn luyện.',
          tip: '🏆 Hãy nhớ cảm giác này - cảm giác kiểm soát và tự tin. Đây là tiêu chuẩn bạn hướng đến.',
          pcAction: null,
          partnerTip: '💑 Chăm sóc sau: Ôm ấp, nói chuyện, tạo kết nối cảm xúc sau khi kết thúc.'
        }
      ]
    }
  ],

  start(onUpdate) {
    this.active = true;
    this.paused = false;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.arousalLevel = 0;
    this.currentPhaseIndex = 0;
    this.currentStepIndex = 0;
    this.sessionLog = [];
    this.onUpdate = onUpdate;

    this.tick();
  },

  tick() {
    if (!this.active) return;
    if (this.paused) return;

    this.interval = setInterval(() => {
      if (this.paused) return;
      this.elapsedSeconds++;
      this.updateState();
      this.notify();
    }, 1000);
  },

  updateState() {
    const phase = this.PHASES[this.currentPhaseIndex];
    if (!phase) return;

    const phaseElapsed = this.getPhaseElapsed();

    // Find current step
    let stepIdx = 0;
    for (let i = phase.steps.length - 1; i >= 0; i--) {
      if (phaseElapsed >= phase.steps[i].time) {
        stepIdx = i;
        break;
      }
    }
    this.currentStepIndex = stepIdx;

    // Smooth arousal interpolation
    const currentStep = phase.steps[stepIdx];
    const nextStep = phase.steps[stepIdx + 1];
    if (nextStep) {
      const progress = (phaseElapsed - currentStep.time) / (nextStep.time - currentStep.time);
      this.arousalLevel = currentStep.arousal + (nextStep.arousal - currentStep.arousal) * Math.min(progress, 1);
    } else {
      this.arousalLevel = currentStep.arousal;
    }

    // Add slight random variation for realism
    this.arousalLevel += (Math.random() - 0.5) * 0.2;
    this.arousalLevel = Math.max(0, Math.min(10, this.arousalLevel));

    // Advance phase
    if (phaseElapsed >= phase.duration) {
      if (this.currentPhaseIndex < this.PHASES.length - 1) {
        this.currentPhaseIndex++;
        this.currentStepIndex = 0;
      } else {
        this.finish();
      }
    }
  },

  getPhaseElapsed() {
    let elapsed = this.elapsedSeconds;
    for (let i = 0; i < this.currentPhaseIndex; i++) {
      elapsed -= this.PHASES[i].duration;
    }
    return Math.max(0, elapsed);
  },

  getTotalDuration() {
    return this.PHASES.reduce((sum, p) => sum + p.duration, 0);
  },

  getOverallProgress() {
    return Math.min(this.elapsedSeconds / this.getTotalDuration(), 1);
  },

  // Skip to next phase immediately
  skipToNextPhase() {
    if (!this.active) return;
    clearInterval(this.interval);

    if (this.currentPhaseIndex < this.PHASES.length - 1) {
      // Jump elapsed to the start of the next phase
      let phaseStart = 0;
      for (let i = 0; i <= this.currentPhaseIndex; i++) {
        phaseStart += this.PHASES[i].duration;
      }
      this.elapsedSeconds = phaseStart;
      this.currentPhaseIndex++;
      this.currentStepIndex = 0;
      this.notify();
      this.tick();
    } else {
      this.finish();
    }
  },

  // Skip to next step within current phase
  skipToNextStep() {
    if (!this.active) return;
    const phase = this.PHASES[this.currentPhaseIndex];
    if (!phase) return;

    const nextStepIdx = this.currentStepIndex + 1;
    if (nextStepIdx < phase.steps.length) {
      const nextStep = phase.steps[nextStepIdx];
      // Advance elapsed to the next step's time offset within the phase
      let phaseStart = 0;
      for (let i = 0; i < this.currentPhaseIndex; i++) {
        phaseStart += this.PHASES[i].duration;
      }
      this.elapsedSeconds = phaseStart + nextStep.time;
      this.currentStepIndex = nextStepIdx;
      this.arousalLevel = nextStep.arousal;
      this.notify();
    } else {
      // Last step in phase → skip to next phase
      this.skipToNextPhase();
    }
  },

  pause() {
    this.paused = true;
    clearInterval(this.interval);
    this.notify();
  },

  resume() {
    this.paused = false;
    this.tick();
    this.notify();
  },

  stop() {
    this.active = false;
    this.paused = false;
    clearInterval(this.interval);
    this.notify();
  },

  finish() {
    this.active = false;
    clearInterval(this.interval);
    Storage.addSession({
      duration: this.elapsedSeconds,
      type: 'simulation',
      phases: this.PHASES.length
    });
    this.notify();
  },

  notify() {
    if (!this.onUpdate) return;
    const phase = this.PHASES[this.currentPhaseIndex];
    const step = phase ? phase.steps[this.currentStepIndex] : null;

    this.onUpdate({
      active: this.active,
      paused: this.paused,
      elapsed: this.elapsedSeconds,
      arousal: this.arousalLevel,
      arousalRounded: Math.round(this.arousalLevel * 10) / 10,
      phase,
      phaseIndex: this.currentPhaseIndex,
      step,
      stepIndex: this.currentStepIndex,
      progress: this.getOverallProgress(),
      phaseProgress: phase ? this.getPhaseElapsed() / phase.duration : 0,
      arousalColor: this.getArousalColor(),
      arousalLabel: this.AROUSAL_LABELS[Math.min(Math.round(this.arousalLevel), 10)],
      totalPhases: this.PHASES.length
    });
  },

  getArousalColor() {
    const level = Math.round(this.arousalLevel);
    return this.AROUSAL_COLORS[Math.max(0, Math.min(10, level))];
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
};
