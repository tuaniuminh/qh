// ============================================================
// APP.JS - Main Application Controller
// ============================================================

const App = {
  currentPage: 'home',
  currentTheoryModule: 0,

  THEORY_MODULES: [
    {
      id: 'pc-muscle',
      title: 'Cơ PC là gì?',
      icon: '💪',
      color: '#4ade80',
      readTime: '5 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #052e16, #14532d)">
            <div class="theory-hero-icon">💪</div>
            <h2>Cơ PC (Pubococcygeus)</h2>
            <p class="theory-subtitle">Cơ kiểm soát tình dục quan trọng nhất của nam giới</p>
          </div>

          <div class="theory-card">
            <h3>🔬 Giải phẫu học</h3>
            <p>Cơ PC (Pubococcygeus - đọc là "pubo-coc-ci-geus") là một cơ quan trọng thuộc nhóm cơ sàn chậu. Nó kéo dài từ xương mu (pubic bone) đến xương cụt (coccyx), tạo thành một "võng" đỡ các cơ quan vùng chậu.</p>
            <div class="anatomy-diagram">
              <div class="anatomy-label">🦴 Xương mu</div>
              <div class="anatomy-muscle">
                <span>━━━━━ CƠ PC ━━━━━</span>
                <span class="anatomy-arrows">↕ Siết ↕ Thả ↕</span>
              </div>
              <div class="anatomy-label">🦴 Xương cụt</div>
            </div>
          </div>

          <div class="theory-card">
            <h3>⚡ Vai trò trong tình dục</h3>
            <ul class="theory-list">
              <li><span class="list-icon">🎯</span><div><strong>Kiểm soát xuất tinh:</strong> Cơ PC khi được rèn luyện có thể trì hoãn phản xạ xuất tinh đáng kể</div></li>
              <li><span class="list-icon">💪</span><div><strong>Chất lượng cương dương:</strong> Cơ PC khỏe giúp duy trì cương dương tốt hơn</div></li>
              <li><span class="list-icon">🌡️</span><div><strong>Cường độ cực khoái:</strong> Cơ PC mạnh = cực khoái mạnh và sâu hơn</div></li>
              <li><span class="list-icon">🏃</span><div><strong>Kiểm soát bàng quang:</strong> Ngăn tiểu không tự chủ</div></li>
            </ul>
          </div>

          <div class="theory-card highlight-card">
            <h3>🔍 Cách tìm cơ PC</h3>
            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <p>Khi đang đi tiểu, thử <strong>nín tiểu đột ngột</strong> → cơ bạn đang dùng chính là cơ PC</p>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <p>Thử "nhấc" tinh hoàn lên mà không dùng tay → đó cũng là cơ PC</p>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <p>Không siết mông, bụng, hoặc đùi - chỉ siết đúng cơ PC</p>
              </div>
            </div>
          </div>

          <div class="theory-card warning-card">
            <h3>⚠️ Lỗi phổ biến</h3>
            <ul class="theory-list">
              <li><span class="list-icon">❌</span><div>Siết cơ mông thay vì cơ PC</div></li>
              <li><span class="list-icon">❌</span><div>Nín thở khi siết cơ PC</div></li>
              <li><span class="list-icon">❌</span><div>Siết quá mạnh ngay từ đầu</div></li>
              <li><span class="list-icon">❌</span><div>Không thả lỏng hoàn toàn sau mỗi lần siết</div></li>
              <li><span class="list-icon">✅</span><div>Đúng: Siết nhẹ-vừa, thở đều, thả lỏng hoàn toàn</div></li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: 'arousal-scale',
      title: 'Thang đo hưng phấn',
      icon: '📊',
      color: '#f59e0b',
      readTime: '4 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #431407, #7c2d12)">
            <div class="theory-hero-icon">📊</div>
            <h2>Thang đo hưng phấn 0-10</h2>
            <p class="theory-subtitle">Công cụ quan trọng nhất trong kiểm soát xuất tinh</p>
          </div>

          <div class="theory-card">
            <h3>🎯 Tại sao cần thang đo?</h3>
            <p>Xuất tinh sớm xảy ra vì não không nhận ra tín hiệu "sắp đến ngưỡng" đủ sớm. Thang đo hưng phấn giúp bạn <strong>số hóa cảm giác</strong> và phát triển khả năng tự theo dõi chính xác.</p>
          </div>

          <div class="arousal-scale-full">
            <div class="arousal-item" style="--color: #4ade80">
              <div class="arousal-bar" style="width: 10%"></div>
              <div class="arousal-info">
                <strong>0-2: Bình thường / Kích thích nhẹ</strong>
                <p>Cơ thể thư giãn, dễ kiểm soát. Giai đoạn tiền희.</p>
              </div>
            </div>
            <div class="arousal-item" style="--color: #facc15">
              <div class="arousal-bar" style="width: 40%"></div>
              <div class="arousal-info">
                <strong>3-5: Hưng phấn vừa phải</strong>
                <p>Cảm giác tốt, vẫn dễ kiểm soát. Duy trì ở đây lâu nhất.</p>
              </div>
            </div>
            <div class="arousal-item" style="--color: #fb923c">
              <div class="arousal-bar" style="width: 60%"></div>
              <div class="arousal-info">
                <strong>6-7: Ngưỡng cảnh báo ⚠️</strong>
                <p>BẮT ĐẦU kiểm soát ở đây. Giảm nhịp, siết PC.</p>
              </div>
            </div>
            <div class="arousal-item" style="--color: #ef4444">
              <div class="arousal-bar" style="width: 80%"></div>
              <div class="arousal-info">
                <strong>8-9: Nguy hiểm!</strong>
                <p>DỪNG NGAY. Siết PC mạnh. Thở bụng.</p>
              </div>
            </div>
            <div class="arousal-item" style="--color: #7f1d1d">
              <div class="arousal-bar" style="width: 100%"></div>
              <div class="arousal-info">
                <strong>10: Điểm không thể dừng 🚨</strong>
                <p>Không thể kiểm soát. Mục tiêu: Đừng để đến đây bất ngờ.</p>
              </div>
            </div>
          </div>

          <div class="theory-card highlight-card">
            <h3>🎯 Quy tắc 7/10</h3>
            <p>Khi hưng phấn chạm <strong>7/10</strong>, đây là thời điểm VÀNG để:</p>
            <div class="step-guide">
              <div class="step-item"><div class="step-num">1</div><p>Dừng hoặc giảm tốc độ ngay lập tức</p></div>
              <div class="step-item"><div class="step-num">2</div><p>Siết cơ PC mạnh và giữ 5-8 giây</p></div>
              <div class="step-item"><div class="step-num">3</div><p>Thở bụng sâu 3-5 lần</p></div>
              <div class="step-item"><div class="step-num">4</div><p>Chuyển sang kỹ thuật tương tác khác cho đối tác</p></div>
            </div>
          </div>

          <div class="theory-card">
            <h3>📈 Cách luyện nhận biết</h3>
            <p>Trong quá trình thực hành, mỗi khi bạn chú ý đến cảm giác của mình, hãy tự hỏi: "Tôi đang ở mức mấy?" Dần dần não sẽ tự động theo dõi mà không cần nỗ lực có ý thức.</p>
            <p class="theory-note">💡 Nghiên cứu cho thấy: Chỉ cần 4-6 tuần luyện tập nhận biết, phần lớn nam giới có thể đánh giá chính xác mức hưng phấn của mình trong thời gian thực.</p>
          </div>
        </div>
      `
    },
    {
      id: 'kegel-technique',
      title: 'Kỹ thuật Kegel',
      icon: '🏋️',
      color: '#60a5fa',
      readTime: '6 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #0c2340, #1e3a5f)">
            <div class="theory-hero-icon">🏋️</div>
            <h2>Kegel - Kỹ thuật siết cơ PC</h2>
            <p class="theory-subtitle">Bài tập nền tảng cho mọi kỹ năng kiểm soát</p>
          </div>

          <div class="theory-card">
            <h3>📖 Lịch sử</h3>
            <p>Bài tập Kegel được phát triển bởi bác sĩ Arnold Kegel vào năm 1948. Ban đầu dành cho phụ nữ sau sinh, sau đó được nghiên cứu và áp dụng rộng rãi cho nam giới trong điều trị xuất tinh sớm và rối loạn cương dương.</p>
          </div>

          <div class="theory-card highlight-card">
            <h3>✅ Kegel chuẩn - Từng bước</h3>
            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Tư thế:</strong> Nằm, ngồi hoặc đứng đều được. Thoải mái nhất.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Xác định cơ:</strong> Tưởng tượng đang nín tiểu. Cơ đó chính là cơ PC.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Siết:</strong> Siết cơ PC, giữ 3-10 giây tùy trình độ. Thở đều trong khi siết.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Thả lỏng:</strong> Thả hoàn toàn trong 5-10 giây. Đây là bước quan trọng nhất!
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">5</div>
                <div>
                  <strong>Lặp lại:</strong> 10-20 lần × 2-3 set mỗi ngày.
                </div>
              </div>
            </div>
          </div>

          <div class="theory-card">
            <h3>💡 Ứng dụng trong thực hành</h3>
            <ul class="theory-list">
              <li>
                <span class="list-icon">🟢</span>
                <div><strong>Kegel nhẹ (mức 1-4 hưng phấn):</strong> Siết 2-3 giây, thả 5 giây. Duy trì kiểm soát nền.</div>
              </li>
              <li>
                <span class="list-icon">🟡</span>
                <div><strong>Kegel vừa (mức 5-6 hưng phấn):</strong> Siết 4-5 giây, thả 8 giây. Bắt đầu kiểm soát tích cực.</div>
              </li>
              <li>
                <span class="list-icon">🔴</span>
                <div><strong>Kegel khẩn cấp (mức 7+ hưng phấn):</strong> Siết MẠNH 5-8 giây, không di chuyển, thở ra từ từ.</div>
              </li>
            </ul>
          </div>

          <div class="theory-card">
            <h3>📅 Lịch tập khuyến nghị</h3>
            <div class="schedule-grid">
              <div class="schedule-item">
                <div class="schedule-week">Tuần 1-2</div>
                <div class="schedule-detail">Siết 3s, thả 6s<br/>10 hiệp × 3 set/ngày<br/>Cơ bản Kegel</div>
              </div>
              <div class="schedule-item">
                <div class="schedule-week">Tuần 3-4</div>
                <div class="schedule-detail">Siết 5s, thả 10s<br/>15 hiệp × 3 set/ngày<br/>+ Thêm Reverse</div>
              </div>
              <div class="schedule-item">
                <div class="schedule-week">Tuần 5-8</div>
                <div class="schedule-detail">Siết 10s, thả 5s<br/>20 hiệp × 4 set/ngày<br/>Nâng cao toàn diện</div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'reverse-kegel',
      title: 'Reverse Kegel',
      icon: '🌊',
      color: '#a78bfa',
      readTime: '5 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #1e1b4b, #312e81)">
            <div class="theory-hero-icon">🌊</div>
            <h2>Reverse Kegel - Bí quyết nâng cao</h2>
            <p class="theory-subtitle">Kỹ thuật ít được biết đến nhưng cực kỳ hiệu quả</p>
          </div>

          <div class="theory-card highlight-card">
            <h3>🔄 Reverse Kegel là gì?</h3>
            <p>Trong khi Kegel thông thường là <strong>siết</strong> cơ PC, Reverse Kegel là <strong>thả lỏng chủ động và sâu</strong> cơ PC và cơ sàn chậu. Đây là kỹ năng đối nghịch nhưng bổ sung hoàn hảo.</p>
            <p class="theory-note">💡 Nghiên cứu cho thấy: Nam giới bị xuất tinh sớm thường có cơ PC CĂNG THẲNG mãn tính. Reverse Kegel giải quyết tận gốc vấn đề này.</p>
          </div>

          <div class="theory-card">
            <h3>📖 Cơ chế hoạt động</h3>
            <p>Khi hưng phấn tăng cao, cơ PC thường phản xạ căng lên → kích hoạt phản xạ xuất tinh. Reverse Kegel ngắt vòng phản xạ này bằng cách:</p>
            <ul class="theory-list">
              <li><span class="list-icon">→</span><div>Chủ động thả lỏng cơ PC → giảm áp lực vùng chậu</div></li>
              <li><span class="list-icon">→</span><div>Giảm nhạy cảm thần kinh cục bộ</div></li>
              <li><span class="list-icon">→</span><div>Tạo khoảng thời gian "reset" cho hệ thần kinh</div></li>
            </ul>
          </div>

          <div class="theory-card highlight-card">
            <h3>🏃 Kỹ thuật thực hiện</h3>
            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Hít vào sâu bằng bụng:</strong> Bụng phình ra, không phải ngực. Cảm nhận vùng chậu nở rộng.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Khi thở ra:</strong> "Đẩy nhẹ xuống" như đang rặn nhẹ (không rặn mạnh!). Cơ sàn chậu sẽ thả ra.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Giữ tư thế thả lỏng:</strong> 3-8 giây trong khi tiếp tục thở nhẹ nhàng.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Hít vào bình thường:</strong> Để cơ tự nhiên trở về trạng thái nghỉ.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">5</div>
                <div>
                  <strong>Lặp lại 5-8 lần:</strong> Mỗi lần thực hiện giúp hưng phấn giảm 1-2 bậc.
                </div>
              </div>
            </div>
          </div>

          <div class="theory-card warning-card">
            <h3>⚠️ Lưu ý quan trọng</h3>
            <ul class="theory-list">
              <li><span class="list-icon">⚠️</span><div>Không rặn mạnh - chỉ "đẩy nhẹ" và thả lỏng</div></li>
              <li><span class="list-icon">⚠️</span><div>Cảm giác lạ lúc đầu là bình thường, tiếp tục kiên nhẫn</div></li>
              <li><span class="list-icon">⚠️</span><div>Kết hợp với thở bụng sâu mới đạt hiệu quả tối đa</div></li>
              <li><span class="list-icon">✅</span><div>Đây là kỹ năng cần 2-4 tuần để thành thạo</div></li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: 'partner-care',
      title: 'Chăm sóc đối tác khi dừng',
      icon: '💑',
      color: '#f472b6',
      readTime: '4 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #4a0025, #831843)">
            <div class="theory-hero-icon">💑</div>
            <h2>Nghệ thuật giữ hứng cho đối tác</h2>
            <p class="theory-subtitle">Kỹ năng xã hội quan trọng không kém kỹ thuật</p>
          </div>

          <div class="theory-card highlight-card">
            <h3>🎭 Vấn đề thực tế</h3>
            <p>Khi bạn cần dừng lại để kiểm soát hưng phấn, đối tác có thể cảm thấy bối rối, tụt hứng, hoặc lo lắng. Giải quyết tốt vấn đề này = trải nghiệm tốt cho cả hai.</p>
          </div>

          <div class="theory-card">
            <h3>🔄 Chuyển đổi mượt mà - Kỹ thuật "Chuyển cầu"</h3>
            <p>Khi cần dừng, thay vì dừng hoàn toàn, hãy ngay lập tức "chuyển cầu" sang hoạt động khác:</p>
            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div><strong>Hôn sâu:</strong> Hôn đột ngột và mãnh liệt. Đối tác sẽ hiểu là bạn đang tăng cường độ cảm xúc chứ không phải dừng.</div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div><strong>Vuốt ve toàn thân:</strong> Dùng tay khám phá cơ thể đối tác. Vùng cổ, lưng, đùi là những điểm nhạy cảm cao.</div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div><strong>Thì thầm:</strong> Nói điều gì đó dịu dàng hoặc hấp dẫn. Giọng nói tạo kết nối cảm xúc mạnh.</div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div><strong>Thay đổi tư thế:</strong> Đề nghị đổi tư thế - tạo sự hứng khởi mới và giải thích cho việc "dừng".</div>
              </div>
            </div>
          </div>

          <div class="theory-card">
            <h3>💬 Giao tiếp - Nền tảng của mọi kỹ thuật</h3>
            <p>Với đối tác tin cậy, hãy giao tiếp thẳng thắn:</p>
            <ul class="theory-list">
              <li><span class="list-icon">💬</span><div>"Anh muốn tận hưởng lâu hơn cùng em" - Câu này tạo cảm giác tích cực</div></li>
              <li><span class="list-icon">💬</span><div>Chia sẻ về việc bạn đang luyện tập - đối tác thường trở thành đồng hành tốt nhất</div></li>
              <li><span class="list-icon">💬</span><div>Hỏi về cảm giác của đối tác và đáp ứng nhu cầu của họ</div></li>
            </ul>
          </div>

          <div class="theory-card">
            <h3>🎯 Kỹ thuật "Mở rộng trải nghiệm"</h3>
            <p>Trong 30-60 giây dừng để kiểm soát, sử dụng thời gian đó để:</p>
            <ul class="theory-list">
              <li><span class="list-icon">✨</span><div>Kích thích đối tác bằng tay hoặc miệng - họ sẽ hài lòng hơn, không phải tụt hứng</div></li>
              <li><span class="list-icon">✨</span><div>Tạo sự hồi hộp: "Anh muốn em cảm thấy tốt hơn"</div></li>
              <li><span class="list-icon">✨</span><div>Massage nhẹ: Lưng, vai, cổ - tạo cảm giác được chăm sóc</div></li>
            </ul>
          </div>

          <div class="theory-card highlight-card">
            <h3>🏆 Thực tế từ nghiên cứu</h3>
            <p>Nghiên cứu từ Journal of Sexual Medicine (2019) cho thấy: Nam giới kiểm soát tốt hưng phấn và biết chăm sóc đối tác trong giai đoạn dừng được đánh giá cao hơn về kỹ năng tình dục so với nam giới chỉ kéo dài thời gian đơn thuần.</p>
            <p class="theory-note">💡 Chất lượng > Số lượng thời gian</p>
          </div>
        </div>
      `
    },
    {
      id: 'combat-guide',
      title: 'Thực chiến toàn trình',
      icon: '⚔️',
      color: '#f43f5e',
      readTime: '10 phút',
      content: `
        <div class="theory-section">
          <div class="theory-hero" style="background: linear-gradient(135deg, #1a0010, #4a0020, #7f1d1d)">
            <div class="theory-hero-icon">⚔️</div>
            <h2>Hướng dẫn thực chiến toàn trình</h2>
            <p class="theory-subtitle">Từng bước — từng giai đoạn — từng kỹ thuật trong buổi quan hệ thực tế</p>
          </div>

          <!-- TỔNG QUAN -->
          <div class="theory-card highlight-card">
            <h3>🗺️ Bản đồ toàn buổi</h3>
            <p>Một buổi quan hệ được chia thành <strong>5 giai đoạn chính</strong>. Hiểu rõ từng giai đoạn giúp bạn luôn chủ động và không bị cuốn theo bản năng.</p>
            <div class="combat-roadmap">
              <div class="roadmap-item">
                <span class="roadmap-num">1</span>
                <span class="roadmap-name">Chuẩn bị tâm lý & thể chất</span>
                <span class="roadmap-time">Trước quan hệ</span>
              </div>
              <div class="roadmap-arrow">↓</div>
              <div class="roadmap-item">
                <span class="roadmap-num">2</span>
                <span class="roadmap-name">Giai đoạn tiền희 (Foreplay)</span>
                <span class="roadmap-time">10–20 phút</span>
              </div>
              <div class="roadmap-arrow">↓</div>
              <div class="roadmap-item">
                <span class="roadmap-num">3</span>
                <span class="roadmap-name">Giao hợp — Vùng kiểm soát (0–6/10)</span>
                <span class="roadmap-time">Tùy kiểm soát</span>
              </div>
              <div class="roadmap-arrow">↓</div>
              <div class="roadmap-item roadmap-item--danger">
                <span class="roadmap-num">4</span>
                <span class="roadmap-name">⚠️ Vùng ngưỡng (6–8/10) — Quyết định thành bại</span>
                <span class="roadmap-time">30–60 giây</span>
              </div>
              <div class="roadmap-arrow">↓</div>
              <div class="roadmap-item">
                <span class="roadmap-num">5</span>
                <span class="roadmap-name">Hồi phục & chu kỳ mới / Kết thúc có kiểm soát</span>
                <span class="roadmap-time">Lặp lại 2–5 lần</span>
              </div>
            </div>
          </div>

          <!-- GIAI ĐOẠN 1: CHUẨN BỊ -->
          <div class="theory-card">
            <h3>🧘 Giai đoạn 1: Chuẩn bị (Trước quan hệ)</h3>
            <p>50% thành công được quyết định <strong>trước khi bắt đầu</strong>. Tâm trí lo lắng = cơ PC căng sớm = mất kiểm soát nhanh hơn.</p>

            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Thở bụng 5 lần sâu:</strong> Hít vào 4s → giữ 2s → thở ra 6s. Kích hoạt hệ thần kinh phó giao cảm (chế độ thư giãn). Làm ngay trước khi bắt đầu.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Thả lỏng cơ toàn thân:</strong> Kiểm tra vai → thả. Kiểm tra hàm → thả. Kiểm tra cơ PC → thả hoàn toàn. Cơ PC căng sẵn sẽ khiến bạn đạt ngưỡng nhanh hơn 2–3 lần.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Đặt mục tiêu nhỏ:</strong> Không đặt mục tiêu "phải kéo dài X phút". Thay vào đó: "Tôi sẽ chú ý nhận biết mức hưng phấn và kiểm soát ít nhất 1 lần tại ngưỡng 7/10."
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Không lo lắng về kết quả:</strong> Lo lắng là kẻ thù số 1. Lo lắng → căng thẳng → adrenaline → mất kiểm soát nhanh hơn. Hãy xem đây là buổi "thực hành có hướng dẫn".
                </div>
              </div>
            </div>
            <div class="theory-note" style="margin-top:12px">
              ⚠️ <strong>Lưu ý:</strong> Nếu vừa thủ dâm gần đây (trong vòng 3–6 tiếng), cơ thể đang ở "refractory period" — sẽ khó kiểm soát hơn. Lên lịch hợp lý.
            </div>
          </div>

          <!-- GIAI ĐOẠN 2: TIỀN희 -->
          <div class="theory-card">
            <h3>💑 Giai đoạn 2: Tiền戏 — Foreplay (10–20 phút)</h3>
            <p>Foreplay <strong>không phải chờ đợi</strong> — đây là giai đoạn bạn xây dựng hưng phấn cho đối tác đồng thời <strong>kiểm tra và kiểm soát hưng phấn của mình</strong> trước khi vào giao hợp chính.</p>

            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Hưng phấn mục tiêu của BẠN: 2–3/10</strong><br>
                  Duy trì cơ PC thả lỏng. Nếu hưng phấn của bạn đã lên 4–5/10 trong foreplay, hãy điều tiết bằng cách tập trung hoàn toàn vào đối tác (chứ không phải cảm giác của mình).
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Thở bụng xuyên suốt:</strong> Không nín thở. Hơi thở nông = hưng phấn tăng nhanh không kiểm soát được. Mỗi khi nhận ra mình nín thở, thở ra từ từ ngay lập tức.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Hôn và tiếp xúc ngoài da:</strong> Cổ, tai, vai, lưng của đối tác. Các vùng này kích thích đối tác mà không gây nhiều kích thích trực tiếp cho bạn → kiểm soát được.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Kegel nhẹ 3–5 lần:</strong> Siết 2 giây → thả 5 giây. Để "đánh thức" cơ PC và kiểm tra nó đang phản ứng ra sao. Nếu cơ PC đang tự siết → bạn đang căng thẳng → thả lỏng vai và hàm.
                </div>
              </div>
            </div>
            <div class="theory-note" style="margin-top:12px">
              💡 <strong>Mẹo chuyên gia:</strong> Làm đối tác hưng phấn cao (6–7/10) TRƯỚC khi bắt đầu giao hợp. Khi đối tác đã hưng phấn cao, bạn có thể "dừng" ngắn mà không ảnh hưởng nhiều đến họ.
            </div>
          </div>

          <!-- GIAI ĐOẠN 3: GIAO HỢP VÙNG AN TOÀN -->
          <div class="theory-card">
            <h3>🎯 Giai đoạn 3: Giao hợp — Vùng kiểm soát (Hưng phấn 0–6/10)</h3>
            <p>Đây là giai đoạn bạn <strong>chủ động điều tiết</strong>. Không có "đúng/sai" về tốc độ hay tư thế — chỉ cần luôn biết mình đang ở mức nào.</p>

            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Nhịp di chuyển — Kỹ thuật 9-1:</strong><br>
                  9 cú di chuyển <em>nông</em> (1/3 độ sâu) + 1 cú <em>sâu</em> hoàn toàn. Lặp lại. Cú nông ít kích thích hơn cú sâu khoảng 60% → tốc độ giảm hưng phấn tự nhiên mà đối tác vẫn cảm nhận tốt.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Cơ PC ở mức 3–5/10:</strong> Kegel nhẹ (<em>siết 2–3s → thả 5s</em>). Không siết liên tục — siết liên tục làm cơ mệt và mất phản ứng khi cần dùng khẩn cấp.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Tư thế ảnh hưởng đến tốc độ hưng phấn:</strong>
                  <ul style="margin:6px 0 0 0;padding-left:16px;font-size:13px;color:rgba(240,240,255,0.7)">
                    <li>Bạn ở trên (missionary): hưng phấn tăng chậm → dễ kiểm soát nhất ✅</li>
                    <li>Đối tác ở trên (cowgirl): hưng phấn tăng nhanh → cần theo dõi sát ⚠️</li>
                    <li>Đứng sau (doggy): hưng phấn tăng rất nhanh → cần Kegel mạnh hơn 🔴</li>
                  </ul>
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Thở đồng bộ:</strong> Thở ra khi di chuyển vào, hít vào khi rút ra. Nhịp thở chủ động này giúp não tập trung và giảm hưng phấn tự nhiên 15–20%.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">5</div>
                <div>
                  <strong>Luôn đếm mức hưng phấn:</strong> Cứ 30 giây hỏi bản thân "Mình đang ở mức mấy?". Nếu câu trả lời là 5.5 → bắt đầu chuẩn bị cho ngưỡng. Nếu câu trả lời là 3 → an toàn, tiếp tục.
                </div>
              </div>
            </div>
          </div>

          <!-- GIAI ĐOẠN 4: NGƯỠNG NGUY HIỂM -->
          <div class="theory-card warning-card">
            <h3>🚨 Giai đoạn 4: Vùng ngưỡng (6–8/10) — Giai đoạn QUYẾT ĐỊNH</h3>
            <p>Đây là 30–60 giây quan trọng nhất. Thực hiện đúng = kiểm soát thành công. Thực hiện sai = mất kiểm soát. <strong>Không có trung gian.</strong></p>

            <div class="step-guide">
              <div class="step-item" style="border-left:3px solid #f59e0b">
                <div class="step-num" style="background:#f59e0b">A</div>
                <div>
                  <strong>6/10 — Giai đoạn cảnh báo sớm:</strong><br>
                  Dấu hiệu: Nhịp thở tự nhiên nhanh lên, cơ thắt lưng căng, tập trung vào cảm giác tăng lên.<br>
                  <em>Hành động:</em> Giảm nhịp ngay (không cần dừng hẳn), tăng Kegel vừa (siết 4–5s → thả 8s), thở sâu chủ động.
                </div>
              </div>
              <div class="step-item" style="border-left:3px solid #ef4444">
                <div class="step-num" style="background:#ef4444">B</div>
                <div>
                  <strong>7/10 — NGƯỠNG HÀNH ĐỘNG NGAY:</strong><br>
                  <em>Ngay lập tức:</em>
                  <ol style="margin:6px 0 0 0;padding-left:16px;font-size:13px;color:rgba(240,240,255,0.8)">
                    <li><strong>DỪNG di chuyển hoàn toàn</strong> (không thương lượng)</li>
                    <li><strong>Siết PC mạnh nhất có thể</strong> — như đang nín tiểu khẩn cấp</li>
                    <li><strong>Giữ siết 5–8 giây</strong> — đếm trong đầu: 1...2...3...4...5</li>
                    <li><strong>Thở ra từ từ</strong> trong khi siết (KHÔNG nín thở)</li>
                    <li><strong>Chuyển cầu</strong> sang hôn/vuốt ve đối tác</li>
                  </ol>
                </div>
              </div>
              <div class="step-item" style="border-left:3px solid #dc2626">
                <div class="step-num" style="background:#dc2626">C</div>
                <div>
                  <strong>8/10 — Dùng Reverse Kegel khẩn cấp:</strong><br>
                  Nếu bỏ lỡ ngưỡng 7/10 và đã lên 8:<br>
                  <em>Hành động:</em> DỪNG hoàn toàn + Thở bụng sâu + "Đẩy nhẹ xuống" (Reverse Kegel) 5–8 lần liên tiếp + Nghĩ về điều gì đó không liên quan (giảm hưng phấn tâm lý).
                </div>
              </div>
            </div>

            <div class="theory-note" style="margin-top:14px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:12px">
              🚫 <strong>Tuyệt đối KHÔNG làm khi ở ngưỡng 7–8/10:</strong><br>
              ❌ Tiếp tục di chuyển "thêm một chút"<br>
              ❌ Nín thở hoặc rặn<br>
              ❌ Siết cơ mông hoặc bụng<br>
              ❌ Hoảng loạn (hoảng loạn = adrenaline = hưng phấn tăng vọt)
            </div>
          </div>

          <!-- CHĂM SÓC ĐỐI TÁC KHI DỪNG -->
          <div class="theory-card">
            <h3>💑 Trong lúc dừng: Chăm sóc đối tác (30–60 giây)</h3>
            <p>Khi dừng để kiểm soát, đối tác không được biết bạn đang "cấp cứu hưng phấn". Hãy chuyển sang <strong>một hoạt động khác mượt mà</strong>:</p>

            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Hôn sâu đột ngột:</strong> Nhổm lên hôn mãnh liệt ngay lúc dừng. Đối tác hiểu là bạn đang "tăng cảm xúc" chứ không phải dừng. Giúp bạn thở lại bình thường trong khi siết PC.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Vuốt ve có chủ đích:</strong> Lưng, mông, đùi trong của đối tác. Giữ họ hưng phấn và tập trung vào cảm giác của họ — không phải của bạn. Khi bạn cho đi, hưng phấn của bạn tự giảm.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Thì thầm vào tai:</strong> Nói điều gì đó gợi cảm, hỏi cảm giác của họ. Giọng nói thấp tạo kết nối cảm xúc sâu và giữ không khí không bị "tắt lạnh". Không cần nói nhiều — 1 câu là đủ.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Kích thích bằng tay / miệng:</strong> Trong 30–60 giây chờ hưng phấn hạ, chủ động đưa họ lên cao hơn. Khi quay lại giao hợp, đối tác đang hưng phấn cao hơn → họ gần kết thúc nhanh hơn → bạn có lợi thế.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">5</div>
                <div>
                  <strong>Đề nghị đổi tư thế:</strong> "Anh muốn thử tư thế khác" → vừa giải thích tự nhiên cho việc dừng, vừa tạo sự hứng khởi mới, vừa cho bạn thêm 10–15 giây di chuyển chậm lúc "chuyển tư thế".
                </div>
              </div>
            </div>
          </div>

          <!-- GIAI ĐOẠN 5: HỒI PHỤC -->
          <div class="theory-card">
            <h3>🔄 Giai đoạn 5: Hồi phục & Chu kỳ mới</h3>
            <p>Sau khi kiểm soát thành công tại ngưỡng, hưng phấn hạ về <strong>3–5/10</strong>. Lúc này bắt đầu chu kỳ mới. Mỗi chu kỳ thành công = kinh nghiệm não ghi nhớ = lần sau dễ hơn.</p>

            <div class="step-guide">
              <div class="step-item">
                <div class="step-num">1</div>
                <div>
                  <strong>Reverse Kegel 5–8 lần:</strong> Ngay sau khi thả cơ PC, áp dụng Reverse Kegel để đẩy hưng phấn xuống tích cực hơn. Thở bụng + đẩy nhẹ xuống 3–5 giây × 5–8 lần.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div>
                  <strong>Chờ hưng phấn về 4/10:</strong> Cảm nhận cơ PC đang thả lỏng dần, nhịp tim chậm lại, thở trở lại bình thường. Đây là tín hiệu an toàn để tiếp tục.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div>
                  <strong>Bắt đầu lại nhẹ nhàng:</strong> Nhịp chậm, độ nông, cơ PC thả lỏng hoàn toàn. Không "cố gắng bù" bằng cách di chuyển mạnh hơn sau khi nghỉ — làm vậy sẽ đạt ngưỡng nhanh hơn lần trước.
                </div>
              </div>
              <div class="step-item">
                <div class="step-num">4</div>
                <div>
                  <strong>Mục tiêu: 2–5 chu kỳ kiểm soát:</strong> Mỗi buổi kiểm soát được ≥ 2 lần tại ngưỡng = buổi tập thành công. Khi đạt được 5 chu kỳ ổn định → xuất tinh sớm đã được kiểm soát hoàn toàn.
                </div>
              </div>
            </div>
          </div>

          <!-- BẢNG TÓM TẮT NHANH -->
          <div class="theory-card highlight-card">
            <h3>⚡ Bảng tham chiếu nhanh — In vào đầu</h3>
            <div class="combat-table">
              <div class="combat-row combat-row--header">
                <span>Mức HP</span>
                <span>Cơ PC</span>
                <span>Hành động</span>
              </div>
              <div class="combat-row">
                <span>🟢 0–3</span>
                <span>Thả lỏng</span>
                <span>Di chuyển bình thường, thở đều</span>
              </div>
              <div class="combat-row">
                <span>🟡 3–5</span>
                <span>Kegel nhẹ</span>
                <span>Siết 2s → thả 5s, giảm nhịp nhẹ</span>
              </div>
              <div class="combat-row">
                <span>🟠 5–6</span>
                <span>Kegel vừa</span>
                <span>Siết 4s → thả 8s, thở sâu hơn</span>
              </div>
              <div class="combat-row combat-row--danger">
                <span>🔴 7/10</span>
                <span>SIẾT MẠNH</span>
                <span>DỪNG + Siết 5–8s + Chuyển cầu</span>
              </div>
              <div class="combat-row combat-row--critical">
                <span>💀 8+</span>
                <span>Reverse K.</span>
                <span>DỪNG + Đẩy nhẹ xuống × 8 lần</span>
              </div>
            </div>
          </div>

          <!-- DẤU HIỆU TIẾN BỘ -->
          <div class="theory-card">
            <h3>📈 Dấu hiệu bạn đang tiến bộ</h3>
            <ul class="theory-list">
              <li><span class="list-icon">✅</span><div>Nhận ra được mức hưng phấn của mình trong thực tế (tuần 1–2)</div></li>
              <li><span class="list-icon">✅</span><div>Kiểm soát được ít nhất 1 lần tại ngưỡng 7/10 trong một buổi (tuần 3–4)</div></li>
              <li><span class="list-icon">✅</span><div>Dừng được mà không bị mất kiểm soát hoàn toàn (tuần 4–6)</div></li>
              <li><span class="list-icon">✅</span><div>Kiểm soát được 2–3 chu kỳ liên tiếp (tuần 6–8)</div></li>
              <li><span class="list-icon">🏆</span><div>Kiểm soát chủ động TRƯỚC ngưỡng, không cần "cấp cứu" (tháng 2–3)</div></li>
            </ul>
          </div>

          <!-- LỜI NHẮC CUỐI -->
          <div class="theory-card" style="border-color:rgba(108,99,255,0.3);background:rgba(108,99,255,0.06)">
            <h3>💜 Nhớ luôn</h3>
            <p style="font-size:15px;line-height:1.7;color:rgba(240,240,255,0.8)">
              Xuất tinh sớm <strong>không phải lỗi của bạn</strong> — đó là phản xạ chưa được luyện tập. Não bộ học cực kỳ nhanh khi được luyện đúng cách. Mỗi buổi thực hành, dù thành công hay thất bại, đều đang ghi thêm "dữ liệu" cho não. Sau 8–12 tuần kiên trì, cơ thể bạn <em>tự động</em> kiểm soát tốt hơn ngay cả khi bạn không cố.
            </p>
            <p class="theory-note">🎯 Kiên trì > Hoàn hảo. Thực hành > Lý thuyết.</p>
          </div>
        </div>
      `
    }
  ],

  init() {
    this.renderApp();
    this.bindEvents();
    this.navigateTo('home');
  },

  renderApp() {
    const navItems = [
      { page: 'home',     icon: '🏠', label: 'Tổng quan' },
      { page: 'theory',   icon: '📚', label: 'Lý thuyết' },
      { page: 'practice', icon: '▶️', label: 'Thực hành', highlight: true },
      { page: 'kegel',    icon: '💪', label: 'Kegel' },
      { page: 'log',      icon: '📈', label: 'Nhật ký' }
    ];

    const navHTML = navItems.map(item => `
      <button class="nav-item ${item.highlight ? 'nav-practice' : ''}" data-page="${item.page}" id="nav-${item.page}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </button>
    `).join('');

    const sidebarHTML = navItems.map(item => `
      <button class="sidebar-item ${item.highlight ? 'sidebar-practice' : ''}" data-page="${item.page}" id="sidebar-${item.page}">
        <span class="sidebar-icon">${item.icon}</span>
        <span class="sidebar-label">${item.label}</span>
      </button>
    `).join('');

    document.getElementById('app').innerHTML = `
      <div class="app-shell">
        <!-- Desktop Sidebar -->
        <aside class="desktop-sidebar" id="desktop-sidebar">
          <div class="sidebar-brand">
            <div class="brand-icon-lg">⚡</div>
            <div>
              <div class="brand-name-lg">MenControl Pro</div>
              <div class="brand-sub">Kiểm soát hoàn hảo</div>
            </div>
          </div>
          <nav class="sidebar-nav" role="navigation" aria-label="Sidebar navigation">
            ${sidebarHTML}
          </nav>
          <div class="sidebar-footer">
            <button class="sidebar-settings-btn" id="sidebar-settings">⚙️ Cài đặt</button>
          </div>
        </aside>

        <!-- Right Panel (mobile: full screen, desktop: main area) -->
        <div class="app-right">
          <!-- Header -->
          <header class="app-header">
            <div class="header-content">
              <div class="header-brand">
                <div class="brand-icon">⚡</div>
                <div>
                  <div class="brand-name">MenControl Pro</div>
                  <div class="brand-sub">Kiểm soát hoàn hảo</div>
                </div>
              </div>
              <div class="header-right">
                <button class="version-badge" id="btn-version"
                  title="Xem phiên bản và cập nhật"
                  aria-label="Phiên bản">
                  ${typeof AppVersion !== 'undefined' ? AppVersion.getShortLabel() : 'VER 1.0.3 PRO'}
                  ${typeof AppVersion !== 'undefined' && AppVersion.hasNewVersion() ? '<span class="ver-dot"></span>' : ''}
                </button>
                <button class="header-btn" id="btn-settings" aria-label="Cài đặt">⚙️</button>
              </div>
            </div>
          </header>

          <!-- Main Content -->
          <main class="app-main" id="main-content">
            <!-- Pages rendered here -->
          </main>

          <!-- Bottom Nav (mobile only) -->
          <nav class="bottom-nav" role="navigation" aria-label="Navigation chính">
            ${navHTML}
          </nav>
        </div>
      </div>
    `;
  },


  bindEvents() {
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => this.navigateTo(btn.dataset.page));
    });

    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.showSettings());
    const sidebarSettings = document.getElementById('sidebar-settings');
    if (sidebarSettings) sidebarSettings.addEventListener('click', () => this.showSettings());

    // Version badge
    const versionBtn = document.getElementById('btn-version');
    if (versionBtn && typeof AppVersion !== 'undefined') {
      versionBtn.addEventListener('click', () => AppVersion.showModal());
    }
  },

  navigateTo(page) {
    this.currentPage = page;

    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    // Update sidebar nav
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Render page
    const main = document.getElementById('main-content');
    main.innerHTML = '';

    switch (page) {
      case 'home': this.renderHome(main); break;
      case 'theory': this.renderTheory(main); break;
      case 'practice': this.renderPractice(main); break;
      case 'kegel': this.renderKegel(main); break;
      case 'log': this.renderLog(main); break;
    }

    // Animate in
    requestAnimationFrame(() => {
      main.style.opacity = '0';
      main.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        main.style.transition = 'all 0.3s ease';
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
      });
    });
  },

  // ============================================================
  // HOME PAGE
  // ============================================================
  renderHome(container) {
    const stats = Storage.getStats();
    const progress = Storage.getProgress();
    const theoryTotal = this.THEORY_MODULES.length;
    const theoryRead = progress.theoryRead.length;

    container.innerHTML = `
      <div class="page-home">
        <div class="home-welcome">
          <div class="welcome-greeting">Chào mừng trở lại 👋</div>
          <h1 class="welcome-title">Con đường kiểm soát</h1>
          <p class="welcome-sub">Mỗi ngày luyện tập là một bước tiến</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">${stats.totalSessions}</div>
            <div class="stat-label">Buổi thực hành</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">${stats.totalMinutes}</div>
            <div class="stat-label">Phút luyện tập</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">${stats.streak}</div>
            <div class="stat-label">Ngày liên tiếp</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">${Math.round(stats.bestSession / 60)}</div>
            <div class="stat-label">Phút tốt nhất</div>
          </div>
        </div>

        <!-- Theory Progress -->
        <div class="home-section">
          <div class="section-header">
            <h2 class="section-title">📚 Tiến độ học</h2>
            <span class="section-badge">${theoryRead}/${theoryTotal}</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${(theoryRead / theoryTotal) * 100}%"></div>
            </div>
            <span class="progress-label">${Math.round((theoryRead / theoryTotal) * 100)}%</span>
          </div>
          <div class="theory-quick-links">
            ${this.THEORY_MODULES.map(m => `
              <button class="theory-chip ${progress.theoryRead.includes(m.id) ? 'read' : ''}" onclick="App.openTheoryModule('${m.id}')">
                ${m.icon} ${m.title.split(' ')[0]}
                ${progress.theoryRead.includes(m.id) ? '<span class="chip-check">✓</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="home-section">
          <h2 class="section-title">🚀 Bắt đầu ngay</h2>
          <div class="quick-actions">
            <button class="quick-btn practice-btn" onclick="App.navigateTo('practice')">
              <div class="quick-btn-icon">▶️</div>
              <div class="quick-btn-text">
                <div class="quick-btn-title">Thực hành</div>
                <div class="quick-btn-sub">Mô phỏng toàn trình</div>
              </div>
              <div class="quick-btn-arrow">→</div>
            </button>
            <button class="quick-btn kegel-btn" onclick="App.navigateTo('kegel')">
              <div class="quick-btn-icon">💪</div>
              <div class="quick-btn-text">
                <div class="quick-btn-title">Luyện Kegel</div>
                <div class="quick-btn-sub">Tăng sức mạnh cơ PC</div>
              </div>
              <div class="quick-btn-arrow">→</div>
            </button>
          </div>
        </div>

        <!-- Daily Tip -->
        <div class="home-section">
          <div class="daily-tip">
            <div class="tip-header">💡 Mẹo hôm nay</div>
            <div class="tip-content">${this.getDailyTip()}</div>
          </div>
        </div>
      </div>
    `;
  },

  getDailyTip() {
    const tips = [
      'Nhớ thả lỏng cơ PC hoàn toàn sau mỗi lần siết. Cơ không được nghỉ ngơi sẽ bị kiệt sức và mất hiệu quả.',
      'Thở bụng đều đặn là nền tảng của mọi kỹ thuật kiểm soát. Luyện thở bụng ngay cả khi không thực hành.',
      'Reverse Kegel hiệu quả nhất khi kết hợp với thở ra sâu. Thử mỗi sáng: 10 lần Reverse Kegel + thở bụng.',
      'Nhận biết mức hưng phấn 7/10 = 50% thành công. Phần còn lại là kỹ thuật Kegel và chuyển tiếp.',
      'Luyện tập Kegel đúng cách 6-8 tuần sẽ cải thiện rõ rệt khả năng kiểm soát trong thực tế.',
      'Căng thẳng tâm lý là nguyên nhân số 1 của xuất tinh sớm. Thiền và thở sâu mỗi ngày giúp ích rất nhiều.',
      'Giao tiếp thành thật với đối tác tạo ra môi trường luyện tập an toàn và hiệu quả hơn.'
    ];
    return tips[new Date().getDay()];
  },

  // ============================================================
  // THEORY PAGE
  // ============================================================
  renderTheory(container) {
    const progress = Storage.getProgress();
    container.innerHTML = `
      <div class="page-theory">
        <div class="page-header">
          <h1 class="page-title">📚 Lý thuyết nền tảng</h1>
          <p class="page-sub">Hiểu đúng để luyện đúng</p>
        </div>
        <div class="theory-modules">
          ${this.THEORY_MODULES.map((m, i) => `
            <button class="theory-module-card ${progress.theoryRead.includes(m.id) ? 'read' : ''}"
                    onclick="App.openTheoryModule('${m.id}')"
                    id="theory-${m.id}"
                    style="--module-color: ${m.color}">
              <div class="module-icon">${m.icon}</div>
              <div class="module-info">
                <div class="module-title">${m.title}</div>
                <div class="module-meta">
                  <span>⏱️ ${m.readTime}</span>
                  ${progress.theoryRead.includes(m.id) ? '<span class="module-read-badge">✓ Đã đọc</span>' : '<span class="module-new-badge">Mới</span>'}
                </div>
              </div>
              <div class="module-arrow">›</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  openTheoryModule(id) {
    const module = this.THEORY_MODULES.find(m => m.id === id);
    if (!module) return;

    Storage.markTheoryRead(id);
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-theory-detail">
        <div class="detail-header">
          <button class="back-btn" onclick="App.navigateTo('theory')">← Quay lại</button>
          <span class="detail-read-time">⏱️ ${module.readTime}</span>
        </div>
        ${module.content}
      </div>
    `;
  },

  // ============================================================
  // PRACTICE PAGE
  // ============================================================
  renderPractice(container) {
    container.innerHTML = `
      <div class="page-practice" id="practice-page">
        <!-- Intro Screen -->
        <div class="practice-intro" id="practice-intro">
          <div class="intro-hero">
            <div class="intro-icon">🎯</div>
            <h1 class="intro-title">Chế độ Thực hành</h1>
            <p class="intro-sub">Mô phỏng toàn bộ quá trình từ đầu đến cuối với hướng dẫn thời gian thực</p>
          </div>

          <div class="intro-phases">
            <h3>6 Giai đoạn thực hành:</h3>
            ${Simulation.PHASES.map((p, i) => `
              <div class="intro-phase">
                <span class="phase-icon" style="color: ${p.color}">${p.icon}</span>
                <span class="phase-name">${p.name}</span>
                <span class="phase-time">${Math.round(p.duration / 60)} phút</span>
              </div>
            `).join('')}
          </div>

          <div class="intro-total">
            Tổng thời gian: ~${Math.round(Simulation.PHASES.reduce((s, p) => s + p.duration, 0) / 60)} phút
          </div>

          <div class="intro-warning">
            <div class="warning-icon">💡</div>
            <p>Đây là mô phỏng giả tưởng giáo dục. Hãy đọc và làm theo hướng dẫn trong quá trình thực hành thực tế.</p>
          </div>

          <button class="start-btn" id="btn-start-practice">
            <span>▶ Bắt đầu mô phỏng</span>
          </button>
        </div>

        <!-- Active Simulation -->
        <div class="practice-active" id="practice-active" style="display:none">
          <!-- Arousal Meter -->
          <div class="arousal-section">
            <div class="arousal-header">
              <span class="arousal-title">Mức hưng phấn</span>
              <span class="arousal-value" id="arousal-value">0.0</span>
            </div>
            <div class="arousal-gauge-wrapper">
              <div class="arousal-gauge" id="arousal-gauge">
                <div class="arousal-fill" id="arousal-fill" style="width:0%"></div>
                <div class="arousal-threshold" style="left:70%"></div>
              </div>
              <div class="arousal-ticks">
                <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
              </div>
            </div>
            <div class="arousal-label" id="arousal-label">Bình thường</div>
          </div>

          <!-- Phase Info -->
          <div class="phase-banner" id="phase-banner">
            <div class="phase-icon-lg" id="phase-icon">🌱</div>
            <div class="phase-info">
              <div class="phase-name-lg" id="phase-name">Đang tải...</div>
              <div class="phase-progress-wrap">
                <div class="phase-progress-bar">
                  <div class="phase-progress-fill" id="phase-progress-fill" style="width:0%"></div>
                </div>
                <span class="phase-time-left" id="phase-time-left">0:00</span>
              </div>
            </div>
          </div>

          <!-- Step Card -->
          <div class="step-card" id="step-card">
            <div class="step-card-header">
              <div class="step-card-title" id="step-title">Chuẩn bị...</div>
            </div>
            <div class="step-card-instruction" id="step-instruction"></div>
            <div class="step-card-tip" id="step-tip"></div>
          </div>

          <!-- PC Action Banner -->
          <div class="pc-action-banner" id="pc-action-banner" style="display:none">
            <div class="pc-action-content" id="pc-action-content"></div>
          </div>

          <!-- Partner Tip -->
          <div class="partner-tip-banner" id="partner-tip-banner" style="display:none">
            <div class="partner-tip-content" id="partner-tip-content"></div>
          </div>

          <!-- Controls -->
          <div class="sim-controls">
            <div class="sim-timer" id="sim-timer">00:00</div>
            <div class="sim-btns">
              <button class="sim-btn pause-btn" id="btn-pause">⏸ Dừng</button>
              <button class="sim-btn stop-btn" id="btn-stop">⏹ Kết thúc</button>
            </div>
          </div>

          <!-- Skip Navigation -->
          <div class="sim-skip-bar">
            <button class="skip-step-btn" id="btn-skip-step" title="Bỏ qua bước hiện tại">
              <span class="skip-icon">⏭</span>
              <span>Bước tiếp theo</span>
            </button>
            <div class="skip-divider"></div>
            <button class="skip-phase-btn" id="btn-skip-phase" title="Chuyển sang giai đoạn tiếp theo">
              <span>Giai đoạn tiếp</span>
              <span class="skip-icon">⏭⏭</span>
            </button>
          </div>

          <!-- Phase Dots -->
          <div class="phase-dots" id="phase-dots">
            ${Simulation.PHASES.map((p, i) => `
              <div class="phase-dot ${i === 0 ? 'active' : ''}" data-phase="${i}" title="${p.name}" style="--dot-color: ${p.color}"></div>
            `).join('')}
          </div>
        </div>

        <!-- Summary Screen -->
        <div class="practice-summary" id="practice-summary" style="display:none">
          <div class="summary-trophy">🏆</div>
          <h2 class="summary-title">Xuất sắc!</h2>
          <p class="summary-sub">Bạn đã hoàn thành buổi thực hành</p>
          <div class="summary-stats" id="summary-stats"></div>
          <button class="start-btn" onclick="App.restartPractice()">
            🔄 Luyện tập lại
          </button>
          <button class="outline-btn" onclick="App.navigateTo('home')">
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    `;

    // Bind practice events
    document.getElementById('btn-start-practice').addEventListener('click', () => this.startPractice());
  },

  startPractice() {
    document.getElementById('practice-intro').style.display = 'none';
    document.getElementById('practice-active').style.display = 'block';

    Simulation.start((state) => {
      this.updatePracticeUI(state);
    });
  },

  updatePracticeUI(state) {
    if (!state.active && !state.paused && state.elapsed > 0) {
      // Session ended
      document.getElementById('practice-active').style.display = 'none';
      document.getElementById('practice-summary').style.display = 'block';
      const mins = Math.floor(state.elapsed / 60);
      const secs = state.elapsed % 60;
      document.getElementById('summary-stats').innerHTML = `
        <div class="summary-stat"><div class="summary-stat-val">${mins}:${secs.toString().padStart(2,'0')}</div><div class="summary-stat-lbl">Thời gian</div></div>
        <div class="summary-stat"><div class="summary-stat-val">${state.phaseIndex + 1}/${state.totalPhases}</div><div class="summary-stat-lbl">Giai đoạn</div></div>
      `;
      return;
    }

    if (!state.phase) return;

    // Arousal
    const arousalPct = (state.arousal / 10) * 100;
    const fill = document.getElementById('arousal-fill');
    if (fill) {
      fill.style.width = `${arousalPct}%`;
      fill.style.background = state.arousalColor;
    }
    const valEl = document.getElementById('arousal-value');
    if (valEl) valEl.textContent = state.arousalRounded.toFixed(1);
    const lblEl = document.getElementById('arousal-label');
    if (lblEl) {
      lblEl.textContent = state.arousalLabel;
      lblEl.style.color = state.arousalColor;
    }

    // Add pulsing if high arousal
    const gauge = document.getElementById('arousal-gauge');
    if (gauge) gauge.classList.toggle('pulse', state.arousal >= 7);

    // Phase
    const phaseEl = document.getElementById('phase-name');
    if (phaseEl) phaseEl.textContent = state.phase.name;
    const phaseIconEl = document.getElementById('phase-icon');
    if (phaseIconEl) phaseIconEl.textContent = state.phase.icon;
    const phaseFill = document.getElementById('phase-progress-fill');
    if (phaseFill) {
      phaseFill.style.width = `${state.phaseProgress * 100}%`;
      phaseFill.style.background = state.phase.color;
    }

    // Phase banner gradient
    const banner = document.getElementById('phase-banner');
    if (banner) banner.style.background = state.phase.bgGradient || 'var(--surface)';

    // Time left in phase
    const timeLeftEl = document.getElementById('phase-time-left');
    if (timeLeftEl) {
      const remaining = state.phase.duration - Math.round(state.phaseProgress * state.phase.duration);
      timeLeftEl.textContent = Simulation.formatTime(Math.max(0, remaining));
    }

    // Step
    if (state.step) {
      const titleEl = document.getElementById('step-title');
      if (titleEl) titleEl.textContent = state.step.title;
      const instrEl = document.getElementById('step-instruction');
      if (instrEl) instrEl.textContent = state.step.instruction;
      const tipEl = document.getElementById('step-tip');
      if (tipEl) tipEl.textContent = state.step.tip || '';

      // PC Action
      const pcBanner = document.getElementById('pc-action-banner');
      if (pcBanner && state.step.pcAction) {
        pcBanner.style.display = 'block';
        const pcContent = document.getElementById('pc-action-content');
        if (pcContent) pcContent.innerHTML = this.getPCActionContent(state.step.pcAction);
      } else if (pcBanner) {
        pcBanner.style.display = 'none';
      }

      // Partner tip
      const partnerBanner = document.getElementById('partner-tip-banner');
      if (partnerBanner && state.step.partnerTip) {
        partnerBanner.style.display = 'block';
        const partnerContent = document.getElementById('partner-tip-content');
        if (partnerContent) partnerContent.textContent = state.step.partnerTip;
      } else if (partnerBanner) {
        partnerBanner.style.display = 'none';
      }
    }

    // Timer
    const timerEl = document.getElementById('sim-timer');
    if (timerEl) timerEl.textContent = Simulation.formatTime(state.elapsed);

    // Phase dots
    document.querySelectorAll('.phase-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === state.phaseIndex);
      dot.classList.toggle('done', i < state.phaseIndex);
    });

    // Pause button
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.textContent = state.paused ? '▶ Tiếp tục' : '⏸ Dừng';
      if (!pauseBtn._bound) {
        pauseBtn._bound = true;
        pauseBtn.addEventListener('click', () => {
          if (Simulation.paused) Simulation.resume();
          else Simulation.pause();
        });
      }
    }

    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn && !stopBtn._bound) {
      stopBtn._bound = true;
      stopBtn.addEventListener('click', () => {
        Simulation.stop();
        document.getElementById('practice-active').style.display = 'none';
        document.getElementById('practice-intro').style.display = 'block';
      });
    }

    // Skip step button
    const skipStepBtn = document.getElementById('btn-skip-step');
    if (skipStepBtn && !skipStepBtn._bound) {
      skipStepBtn._bound = true;
      skipStepBtn.addEventListener('click', () => {
        Simulation.skipToNextStep();
        // Flash feedback
        skipStepBtn.classList.add('skip-flash');
        setTimeout(() => skipStepBtn.classList.remove('skip-flash'), 400);
      });
    }

    // Skip phase button
    const skipPhaseBtn = document.getElementById('btn-skip-phase');
    if (skipPhaseBtn && !skipPhaseBtn._bound) {
      skipPhaseBtn._bound = true;
      skipPhaseBtn.addEventListener('click', () => {
        const isLast = Simulation.currentPhaseIndex >= Simulation.PHASES.length - 1;
        if (isLast) {
          Simulation.finish();
        } else {
          Simulation.skipToNextPhase();
        }
        skipPhaseBtn.classList.add('skip-flash');
        setTimeout(() => skipPhaseBtn.classList.remove('skip-flash'), 400);
      });
    }

    // Update skip-phase button label for last phase
    if (skipPhaseBtn) {
      const isLast = state.phaseIndex >= state.totalPhases - 1;
      const label = skipPhaseBtn.querySelector('span:first-child');
      if (label) label.textContent = isLast ? 'Kết thúc' : 'Giai đoạn tiếp';
      const icon = skipPhaseBtn.querySelector('.skip-icon');
      if (icon) icon.textContent = isLast ? '🏁' : '⏭⏭';
    }
  },

  getPCActionContent(action) {
    const actions = {
      relax: '<div class="pc-relax">🌊 CƠ PC: Thả lỏng hoàn toàn</div>',
      light_kegel: '<div class="pc-light">💚 KEGEL NHẸ: Siết 2-3s → Thả 5s</div>',
      moderate_kegel: '<div class="pc-moderate">💛 KEGEL VỪA: Siết 4-5s → Thả 8s</div>',
      strong_kegel: '<div class="pc-strong">🟠 KEGEL MẠNH: Siết 6-8s → Thả 10s</div>',
      emergency_kegel: '<div class="pc-emergency">🔴 SIẾT PC KHẨN CẤP: Siết MẠNH → GIỮ 5-8s!</div>',
      hold_kegel: '<div class="pc-hold">🔴 GIỮ SIẾT PC: Đang đếm... Chưa thả!</div>',
      release: '<div class="pc-release">💚 THẢ CƠ PC: Thả TỪ TỪ trong 5 giây</div>',
      reverse_kegel: '<div class="pc-reverse">🟣 REVERSE KEGEL: Thả sâu + Đẩy nhẹ xuống</div>',
      controlled_release: '<div class="pc-ctrl-release">🎯 KIỂM SOÁT CÓ Ý THỨC: Thả dần theo ý chí</div>'
    };
    return actions[action] || '';
  },

  restartPractice() {
    document.getElementById('practice-summary').style.display = 'none';
    document.getElementById('practice-intro').style.display = 'block';
  },

  // ============================================================
  // KEGEL PAGE
  // ============================================================
  renderKegel(container) {
    container.innerHTML = `
      <div class="page-kegel">
        <div class="page-header">
          <h1 class="page-title">💪 Luyện tập Kegel</h1>
          <p class="page-sub">Rèn luyện cơ PC mỗi ngày</p>
        </div>

        <!-- Program Selection -->
        <div class="kegel-programs" id="kegel-programs">
          <h3 class="programs-title">Chọn chương trình:</h3>
          ${Object.entries(KegelTimer.PROGRAMS).map(([key, p]) => `
            <button class="program-card ${key === 'beginner' ? 'selected' : ''}"
                    data-program="${key}"
                    onclick="App.selectKegelProgram('${key}')"
                    id="prog-${key}">
              <div class="prog-dot" style="background: ${p.color}"></div>
              <div class="prog-info">
                <div class="prog-name">${p.name}</div>
                <div class="prog-desc">${p.description}</div>
              </div>
              <div class="prog-select-icon">○</div>
            </button>
          `).join('')}
        </div>

        <!-- Timer Display -->
        <div class="kegel-timer-display" id="kegel-timer-display">
          <div class="kegel-state-label" id="kegel-state-label">Sẵn sàng</div>
          <div class="kegel-circle" id="kegel-circle">
            <svg class="kegel-svg" viewBox="0 0 120 120">
              <circle class="kegel-track" cx="60" cy="60" r="50" />
              <circle class="kegel-progress" id="kegel-prog-circle" cx="60" cy="60" r="50"
                stroke-dasharray="314.16" stroke-dashoffset="314.16" />
            </svg>
            <div class="kegel-circle-content">
              <div class="kegel-time-left" id="kegel-time-left">--</div>
              <div class="kegel-rep-info" id="kegel-rep-info">--</div>
            </div>
          </div>
          <div class="kegel-instruction" id="kegel-instruction">Nhấn bắt đầu để luyện tập</div>
        </div>

        <!-- Controls -->
        <div class="kegel-controls">
          <button class="kegel-start-btn" id="btn-kegel-start" onclick="App.startKegel()">
            💪 Bắt đầu luyện tập
          </button>
          <button class="kegel-stop-btn" id="btn-kegel-stop" style="display:none" onclick="App.stopKegel()">
            ⏹ Dừng
          </button>
        </div>

        <!-- Stats -->
        <div class="kegel-stats">
          <div class="kegel-stat">
            <div class="kegel-stat-val">${Storage.getProgress().kegelSessions}</div>
            <div class="kegel-stat-lbl">Buổi tập</div>
          </div>
          <div class="kegel-stat">
            <div class="kegel-stat-val">${Storage.getProgress().kegelMinutes}</div>
            <div class="kegel-stat-lbl">Phút tổng</div>
          </div>
        </div>
      </div>
    `;

    this.selectedKegelProgram = 'beginner';
  },

  selectedKegelProgram: 'beginner',

  selectKegelProgram(key) {
    this.selectedKegelProgram = key;
    document.querySelectorAll('.program-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.program === key);
      c.querySelector('.prog-select-icon').textContent = c.dataset.program === key ? '●' : '○';
    });
  },

  startKegel() {
    document.getElementById('btn-kegel-start').style.display = 'none';
    document.getElementById('btn-kegel-stop').style.display = 'block';
    document.getElementById('kegel-programs').style.opacity = '0.5';
    document.getElementById('kegel-programs').style.pointerEvents = 'none';

    KegelTimer.start(this.selectedKegelProgram, (state) => {
      this.updateKegelUI(state);
    });
  },

  updateKegelUI(state) {
    const stateLabels = {
      contracting: '💪 SIẾT CƠ PC',
      releasing: '🌊 THẢ LỎNG',
      resting: '😮‍💨 NGHỈ GIỮA SET',
      recovering: '😮‍💨 HỒI PHỤC',
      done: '✅ HOÀN THÀNH!',
      idle: 'Sẵn sàng'
    };

    const stateColors = {
      contracting: '#ef4444',
      releasing: '#4ade80',
      resting: '#60a5fa',
      recovering: '#a78bfa',
      done: '#facc15',
      idle: '#6c63ff'
    };

    const stateInstructions = {
      contracting: 'Siết cơ PC mạnh lên! Tưởng tượng đang nín tiểu. Thở đều.',
      releasing: 'Thả lỏng hoàn toàn. Cảm nhận cơ PC mở ra. Thở bụng sâu.',
      resting: 'Nghỉ ngơi. Thở bình thường. Chuẩn bị cho set tiếp theo.',
      recovering: 'Hồi phục. Thả lỏng cơ sàn chậu.',
      done: 'Xuất sắc! Bạn đã hoàn thành buổi luyện tập Kegel hôm nay!',
      idle: 'Nhấn bắt đầu để luyện tập'
    };

    const stateLbl = document.getElementById('kegel-state-label');
    if (stateLbl) {
      stateLbl.textContent = stateLabels[state.state] || state.state;
      stateLbl.style.color = stateColors[state.state] || '#fff';
    }

    const timeEl = document.getElementById('kegel-time-left');
    if (timeEl) timeEl.textContent = state.timeLeft > 0 ? `${state.timeLeft}s` : (state.state === 'done' ? '🏆' : '--');

    const repEl = document.getElementById('kegel-rep-info');
    if (repEl && state.program) {
      repEl.textContent = `Hiệp ${state.rep + 1}/${state.totalReps} · Set ${state.set}/${state.totalSets}`;
    }

    const instrEl = document.getElementById('kegel-instruction');
    if (instrEl) instrEl.textContent = stateInstructions[state.state] || '';

    // SVG circle progress
    const circle = document.getElementById('kegel-prog-circle');
    if (circle && state.program) {
      const maxTime = state.state === 'contracting' ? state.program.contractTime
                    : state.state === 'releasing' ? state.program.releaseTime
                    : state.state === 'resting' ? state.program.restBetweenSets : 1;
      const progress = 1 - (state.timeLeft / maxTime);
      const circumference = 314.16;
      circle.style.strokeDashoffset = circumference * (1 - progress);
      circle.style.stroke = stateColors[state.state] || '#6c63ff';
    }

    const circle2 = document.getElementById('kegel-circle');
    if (circle2) {
      circle2.style.boxShadow = `0 0 30px ${stateColors[state.state] || '#6c63ff'}40`;
    }

    if (state.state === 'done') {
      document.getElementById('btn-kegel-start').style.display = 'block';
      document.getElementById('btn-kegel-start').textContent = '🔄 Luyện tập lại';
      document.getElementById('btn-kegel-stop').style.display = 'none';
      document.getElementById('kegel-programs').style.opacity = '1';
      document.getElementById('kegel-programs').style.pointerEvents = 'auto';
    }
  },

  stopKegel() {
    KegelTimer.stop();
    document.getElementById('btn-kegel-start').style.display = 'block';
    document.getElementById('btn-kegel-stop').style.display = 'none';
    document.getElementById('kegel-programs').style.opacity = '1';
    document.getElementById('kegel-programs').style.pointerEvents = 'auto';
    document.getElementById('kegel-state-label').textContent = 'Đã dừng';
    document.getElementById('kegel-time-left').textContent = '--';
    document.getElementById('kegel-rep-info').textContent = '--';
  },

  // ============================================================
  // LOG PAGE
  // ============================================================
  renderLog(container) {
    const log = Storage.getLog();
    const stats = Storage.getStats();

    container.innerHTML = `
      <div class="page-log">
        <div class="page-header">
          <h1 class="page-title">📈 Nhật ký & Tiến trình</h1>
          <p class="page-sub">Theo dõi hành trình của bạn</p>
        </div>

        <div class="log-summary">
          <div class="log-sum-item">
            <div class="log-sum-val">${stats.totalSessions}</div>
            <div class="log-sum-lbl">Tổng buổi</div>
          </div>
          <div class="log-sum-item">
            <div class="log-sum-val">${stats.totalMinutes} phút</div>
            <div class="log-sum-lbl">Tổng thời gian</div>
          </div>
          <div class="log-sum-item">
            <div class="log-sum-val">${stats.streak} ngày</div>
            <div class="log-sum-lbl">Streak</div>
          </div>
        </div>

        ${log.length === 0 ? `
          <div class="log-empty">
            <div class="log-empty-icon">📝</div>
            <p>Chưa có dữ liệu. Hãy hoàn thành buổi thực hành đầu tiên!</p>
            <button class="outline-btn" onclick="App.navigateTo('practice')">Bắt đầu thực hành</button>
          </div>
        ` : `
          <div class="log-list">
            <h3>Lịch sử gần đây</h3>
            ${log.map(entry => `
              <div class="log-item">
                <div class="log-item-icon">${entry.type === 'simulation' ? '🎯' : '💪'}</div>
                <div class="log-item-info">
                  <div class="log-item-type">${entry.type === 'simulation' ? 'Thực hành mô phỏng' : 'Luyện Kegel'}</div>
                  <div class="log-item-time">${new Date(entry.date).toLocaleString('vi-VN')}</div>
                </div>
                <div class="log-item-duration">${Math.round((entry.duration || 0) / 60)} phút</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  async showSettings() {
    // Xóa overlay cũ nếu có
    const existing = document.getElementById('settings-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9000;
      background:rgba(6,6,18,0.88);
      backdrop-filter:blur(16px);
      display:flex;align-items:center;justify-content:center;
      padding:24px;
      animation:fade-up 0.2s ease;
    `;

    // Render nội dung từ AuthSystem
    const panelHTML = await AuthSystem.renderSettingsPanel();

    overlay.innerHTML = `
      <div class="settings-panel">
        <div class="settings-panel-header">
          <h2>⚙️ Cài đặt</h2>
          <button class="settings-close-btn" id="settings-close-btn">✕</button>
        </div>
        <div class="settings-panel-body">
          ${panelHTML}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind close
    document.getElementById('settings-close-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    // Bind AuthSystem events
    await AuthSystem.bindSettingsEvents();
  }
};

// ── Boot: App.init() được gọi bởi AuthSystem.showApp() ──
// AuthSystem (auth.js) kiểm tra session → nếu OK mới gọi App.init()
