
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';

const carModelOptions = {
  'vf3': 'VF 3',
  'vf5_plus': 'VF 5 Plus',
  'vf6_eco': 'VF 6 Eco',
  'vf6_plus': 'VF 6 Plus',
  'vf7_eco': 'VF 7 Eco',
  'vf7_plus': 'VF 7 Plus',
  'vf8_eco': 'VF 8 Eco',
  'vf8_plus': 'VF 8 Plus',
  'vf9_eco': 'VF 9 Eco',
  'vf9_plus': 'VF 9 Plus',
  'herio_green': 'Herio Green',
};

const contentStyleOptions = {
  'fomo': 'Viết kiểu FOMO',
  'gay_soc': 'Viết kiểu gây sốc',
  'chuan_ads': 'Viết kiểu chuẩn Facebook Ads',
  'story_telling': 'Viết kiểu story-telling (kể chuyện)',
  'bai_toan_kinh_te': 'Viết kiểu bài toán kinh tế',
  'so_sanh': 'Viết kiểu so sánh với xe cùng tầm giá',
  'so_sanh_phan_khuc': 'Viết kiểu so sánh với xe cùng phân khúc',
};

const contentLengthOptions = {
  'ngan_gon': 'Viết ngắn gọn',
  'dai': 'Viết dài',
};

const postLocationOptions = {
  'tiktok': 'Đăng content TikTok',
  'facebook_profile': 'Đăng content lên Facebook (cá nhân)',
  'facebook_groups': 'Đăng content lên Facebook (hội nhóm VinFast)',
  'facebook_fanpage': 'Đăng content lên Fanpage (bán hàng)',
};

const ContentGenerator = () => {
  const [carModel, setCarModel] = useState(Object.keys(carModelOptions)[0]);
  const [contentStyle, setContentStyle] = useState(Object.keys(contentStyleOptions)[0]);
  const [contentLength, setContentLength] = useState(Object.keys(contentLengthOptions)[0]);
  const [postLocation, setPostLocation] = useState(Object.keys(postLocationOptions)[0]);


  const [isLoading, setIsLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [error, setError] = useState('');

  const handleGeneratePost = async () => {
    setError('');
    setIsLoading(true);
    setGeneratedPost('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Bạn là một chuyên gia marketing mạng xã hội, chuyên tạo nội dung viral cho VinFast trên Facebook và TikTok.

        Nhiệm vụ: Tạo một bài đăng dựa trên các lựa chọn sau:
        - Mẫu xe: ${carModelOptions[carModel]}
        - Phong cách content: ${contentStyleOptions[contentStyle]}
        - Độ dài: ${contentLengthOptions[contentLength]}
        - Nơi đăng bài: ${postLocationOptions[postLocation]}

        Hướng dẫn chi tiết cho từng nơi đăng:
        - Nếu đăng lên "TikTok": Viết dưới dạng kịch bản video ngắn. Bao gồm (1) Ý tưởng hình ảnh/cảnh quay, (2) Lời thoại hoặc văn bản trên màn hình, (3) Gợi ý nhạc nền trendy, và (4) Các hashtag #vinfast #xeđiện #tiktokvinfast.
        - Nếu đăng lên "Facebook (cá nhân)": Viết với giọng văn tự nhiên, thân thiện, như đang chia sẻ một trải nghiệm hoặc cảm xúc cá nhân.
        - Nếu đăng lên "Facebook (hội nhóm VinFast)": Viết như một thành viên của nhóm, tập trung vào các chi tiết kỹ thuật hoặc trải nghiệm sử dụng cụ thể, đặt câu hỏi mở để khuyến khích các thành viên khác thảo luận và chia sẻ kinh nghiệm.
        - Nếu đăng lên "Fanpage (bán hàng)": Viết với giọng văn chuyên nghiệp, nêu bật lợi ích và ưu đãi. Luôn kết thúc bằng một lời kêu gọi hành động (Call To Action) mạnh mẽ như "👉 Nhận báo giá ngay!", "📞 Liên hệ hotline...", hoặc " showroom gần nhất!".

        Quy tắc BẮT BUỘC:
        1. Viết bằng tiếng Việt.
        2. BẮT BUỘC sử dụng RẤT NHIỀU biểu tượng cảm xúc (emoji) thú vị, phù hợp với nội dung để bài viết cực kỳ sinh động và thu hút. 🚗💨⚡️🔋🌳
        3. TUYỆT ĐỐI KHÔNG sử dụng chữ in đậm hoặc bất kỳ định dạng markdown nào (ví dụ: không dùng **chữ** hoặc *chữ*). Toàn bộ văn bản phải ở dạng thuần túy, không định dạng.
        4. Mang đậm phong cách và tinh thần của thương hiệu VinFast: tiên phong, đẳng cấp, công nghệ và vì một tương lai xanh.
        5. Tối ưu cho thuật toán của nền tảng đã chọn.
        
        Hãy bắt đầu viết.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setGeneratedPost(response.text);
    } catch (apiError) {
      console.error('API call failed:', apiError);
      setError('Tạo bài viết thất bại. Vui lòng kiểm tra kết nối và API key của bạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost)
        .then(() => alert('Đã sao chép bài viết!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleShareOnFacebook = () => {
    if (generatedPost) {
      const encodedQuote = encodeURIComponent(generatedPost);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://vinfastauto.com&quote=${encodedQuote}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReset = () => {
    setCarModel(Object.keys(carModelOptions)[0]);
    setContentStyle(Object.keys(contentStyleOptions)[0]);
    setContentLength(Object.keys(contentLengthOptions)[0]);
    setPostLocation(Object.keys(postLocationOptions)[0]);
    setGeneratedPost('');
    setError('');
  };

  return (
    <>
      <section className="input-section">
        <div className="option-group">
          <label htmlFor="car-model-select">1. Chọn mẫu xe</label>
          <div className="select-wrapper">
            <select id="car-model-select" value={carModel} onChange={(e) => setCarModel(e.target.value)}>
              {Object.entries(carModelOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="option-group">
          <label htmlFor="content-style-select">2. Chọn phong cách content</label>
          <div className="select-wrapper">
            <select id="content-style-select" value={contentStyle} onChange={(e) => setContentStyle(e.target.value)}>
              {Object.entries(contentStyleOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="option-group">
          <label htmlFor="content-length-select">3. Chọn độ dài</label>
          <div className="select-wrapper">
            <select id="content-length-select" value={contentLength} onChange={(e) => setContentLength(e.target.value)}>
              {Object.entries(contentLengthOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="option-group">
          <label htmlFor="post-location-select">4. Chọn nơi đăng bài</label>
          <div className="select-wrapper">
            <select id="post-location-select" value={postLocation} onChange={(e) => setPostLocation(e.target.value)}>
              {Object.entries(postLocationOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className="generate-btn"
          onClick={handleGeneratePost} 
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Đang tạo...' : <><span className="button-icon">✨</span> Tạo Bài Viết</>}
        </button>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="output-section" aria-live="polite">
        <h2>Kết Quả Do AI Của Tâm Vũ VinFast Tạo 😘😘😘</h2>
        {isLoading ? (
          <div className="loader-container">
            <div className="loader" role="status" aria-label="Đang tải nội dung"></div>
          </div>
        ) : (
          <>
            <p className={`generated-post ${!generatedPost && 'placeholder-text'}`}>
              {generatedPost || 'Bài viết của bạn sẽ xuất hiện ở đây...'}
            </p>
            {generatedPost && (
              <div className="action-buttons">
                <button className="copy-btn" onClick={handleCopyText}>
                  <span className="button-icon">📋</span> Sao chép
                </button>
                <button className="share-btn" onClick={handleShareOnFacebook}>
                  <span className="button-icon">👍</span> Chia sẻ lên Facebook
                </button>
                <button className="reset-btn" onClick={handleReset}>
                  <span className="button-icon">📝</span> Viết Bài Mới
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

const ImageAnalyzer = () => {
    const [inputType, setInputType] = useState('upload');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [promptText, setPromptText] = useState('Phân tích hình ảnh này và mô tả chi tiết những gì bạn thấy. Nếu có văn bản trong ảnh, hãy trích xuất nó.');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);


    // FIX: reader.result is `string | ArrayBuffer`, but `split` only exists on `string`. Added a type check to handle this and added proper promise rejection.
    const fileToGenerativePart = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result.split(',')[1]);
                } else {
                    reject(new Error("Failed to read file as data URL"));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }
        };
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('Tệp ảnh quá lớn. Vui lòng chọn tệp nhỏ hơn 4MB.');
                return;
            }
            setError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUrlChange = (e) => {
        setImageUrl(e.target.value);
        setImagePreview(e.target.value); // Optimistically show preview
    };

    const handleAnalyze = async () => {
        if ((inputType === 'upload' && !imageFile) || (inputType === 'url' && !imageUrl)) {
            setError('Vui lòng cung cấp một hình ảnh để phân tích.');
            return;
        }

        setError('');
        setIsLoading(true);
        setResult('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let imagePart;

            if (inputType === 'upload' && imageFile) {
                imagePart = await fileToGenerativePart(imageFile);
            } else if (inputType === 'url' && imageUrl) {
                 try {
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    // FIX: reader.result is `string | ArrayBuffer`, but `split` only exists on `string`. Added a type check to handle this.
                    const base64 = await new Promise((resolve, reject) => {
                        reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                                resolve(reader.result.split(',')[1]);
                            } else {
                                reject(new Error("Failed to read blob as data URL"));
                            }
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    imagePart = { inlineData: { data: base64, mimeType: blob.type } };
                } catch (fetchError) {
                    console.error("Failed to fetch image from URL:", fetchError);
                    throw new Error('Không thể tải hình ảnh từ URL. Điều này có thể do lỗi CORS. Vui lòng thử tải ảnh xuống và tải lên trực tiếp.');
                }
            }
            
            if (!imagePart) {
              throw new Error("Không thể xử lý hình ảnh.");
            }
            
            const finalPrompt = `${promptText}\n\nQuy tắc BẮT BUỘC: TUYỆT ĐỐI KHÔNG sử dụng chữ in đậm hoặc bất kỳ định dạng markdown nào (ví dụ: không dùng **chữ** hoặc *chữ*). Toàn bộ văn bản phải ở dạng thuần túy, không định dạng.`;
            const contents = { parts: [{ text: finalPrompt }, imagePart] };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
            });
            
            setResult(response.text);
        } catch (apiError) {
            console.error('API call failed:', apiError);
            setError(apiError.message || 'Phân tích hình ảnh thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyText = () => {
        if (result) {
            navigator.clipboard.writeText(result)
                .then(() => alert('Đã sao chép kết quả!'))
                .catch(err => console.error('Failed to copy:', err));
        }
    };

    const handleReset = () => {
        setImageFile(null);
        setImageUrl('');
        setImagePreview('');
        setPromptText('Phân tích hình ảnh này và mô tả chi tiết những gì bạn thấy. Nếu có văn bản trong ảnh, hãy trích xuất nó.');
        setResult('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };
    
    return (
        <div className="image-analyzer-container">
            <div className="input-method-selector">
                <button className={`input-method-btn ${inputType === 'upload' ? 'active' : ''}`} onClick={() => setInputType('upload')}>
                    <span className="button-icon">📁</span> Tải ảnh lên
                </button>
                <button className={`input-method-btn ${inputType === 'url' ? 'active' : ''}`} onClick={() => setInputType('url')}>
                    <span className="button-icon">🔗</span> Dán URL
                </button>
            </div>

            <div className="image-input-area">
                {inputType === 'upload' ? (
                    <>
                        <input type="file" id="imageUpload" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        <label htmlFor="imageUpload">
                            {imageFile ? `Đã chọn: ${imageFile.name}` : 'Nhấp để chọn hoặc kéo thả ảnh vào đây'}
                        </label>
                    </>
                ) : (
                    <input 
                        type="text" 
                        className="url-input" 
                        placeholder="Dán URL hình ảnh vào đây..." 
                        value={imageUrl} 
                        onChange={handleUrlChange} 
                    />
                )}
            </div>

            {imagePreview && (
                <div className="image-preview-container">
                    <img src={imagePreview} alt="Xem trước hình ảnh" className="image-preview" />
                </div>
            )}
            
            <div className="option-group">
              <label htmlFor="prompt-input">Yêu cầu (Prompt)</label>
              <textarea 
                id="prompt-input"
                className="prompt-input" 
                rows="3"
                value={promptText} 
                onChange={(e) => setPromptText(e.target.value)}
              />
            </div>

            <button className="generate-btn analyze-btn" onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? 'Đang phân tích...' : <><span className="button-icon">🔎</span> Phân Tích Hình Ảnh</>}
            </button>

            {error && <p className="error-message">{error}</p>}

            <section className="output-section" aria-live="polite">
                <h2>Kết Quả Phân Tích</h2>
                {isLoading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>
                        <p className={`generated-post ${!result && 'placeholder-text'}`}>
                            {result || 'Kết quả phân tích hình ảnh sẽ xuất hiện ở đây...'}
                        </p>
                        {result && (
                            <div className="action-buttons">
                                <button className="copy-btn" onClick={handleCopyText}>
                                    <span className="button-icon">📋</span> Sao chép
                                </button>
                                <button className="reset-btn" onClick={handleReset}>
                                  <span className="button-icon">📝</span> Phân Tích Ảnh Mới
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

const TikTokDownloader = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleApiCall = async () => {
        if (!url || !url.includes('tiktok.com')) {
            setError('Vui lòng nhập một link TikTok hợp lệ.');
            return;
        }

        setError('');
        setIsLoading(true);
        setResult(null);

        try {
            // Using a public API for TikTok video downloading.
            // This is necessary because of CORS and server-side processing requirements.
            const response = await fetch(`https://www.tikwm.com/api/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: `url=${encodeURIComponent(url)}`
            });

            if (!response.ok) {
                throw new Error('Yêu cầu đến máy chủ tải xuống thất bại.');
            }

            const data = await response.json();
            
            // FIX: The type of data.code from the API might be inconsistent (number or string).
            // To handle this robustly and avoid potential type errors with strict linters,
            // we explicitly convert to a String and use strict inequality.
            if (String(data.code) !== '0') {
                throw new Error(data.msg || 'Không thể xử lý video từ link này.');
            }
            
            setResult({
                downloadUrl: data.data.play,
                thumbnailUrl: data.data.cover,
                title: data.data.title,
            });

        } catch (apiError) {
            console.error('TikTok download failed:', apiError);
            setError(apiError.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectDownload = async () => {
        if (!result || !result.downloadUrl) return;

        setIsDownloading(true);
        setError('');

        try {
            const response = await fetch(result.downloadUrl);
            if (!response.ok) {
                throw new Error('Không thể tải tệp video từ máy chủ.');
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = objectUrl;
            
            const fileName = result.title ? `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4` : 'tiktok_video.mp4';
            a.download = fileName;
            
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            URL.revokeObjectURL(objectUrl);
            document.body.removeChild(a);

        } catch (downloadError) {
            console.error('Direct download failed:', downloadError);
            setError('Tải trực tiếp thất bại. Video sẽ được mở trong tab mới để bạn có thể tải thủ công.');
            // Fallback to opening in a new tab
            window.open(result.downloadUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleReset = () => {
        setUrl('');
        setError('');
        setResult(null);
    };

    return (
        <div className="tiktok-downloader-container">
            <div className="url-input-group">
                <label htmlFor="tiktok-url-input">Link Video TikTok</label>
                <input
                    id="tiktok-url-input"
                    type="text"
                    className="url-input"
                    placeholder="Dán link video TikTok vào đây, ví dụ: https://www.tiktok.com/@username/video/123..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <button className="generate-btn" onClick={handleApiCall} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : <><span className="button-icon">📥</span> Tải Video</>}
            </button>
            
            {error && <p className="error-message">{error}</p>}
            
            {isLoading && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            {result && (
                <section className="output-section tiktok-result-card">
                    <img src={result.thumbnailUrl} alt="Video thumbnail" className="tiktok-thumbnail" />
                    <h3 className="tiktok-title">{result.title}</h3>
                    <div className="action-buttons">
                         <button
                            className="download-video-btn"
                            onClick={handleDirectDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? 'Đang tải...' : (
                                <>
                                    <span className="button-icon">✅</span> Tải xuống (Không logo)
                                </>
                            )}
                        </button>
                        <button className="reset-btn" onClick={handleReset}>
                            <span className="button-icon">🔄</span> Tải video khác
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};


const App = () => {
  const [activeTab, setActiveTab] = useState('content');

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentGenerator />;
      case 'image':
        return <ImageAnalyzer />;
      case 'tiktok':
        return <TikTokDownloader />;
      default:
        return <ContentGenerator />;
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Tâm Vũ VinFast - Lào gì cũng tôn !!!</h1>
        <p className="subtitle">Trai Đẹp Của Phòng Kinh Doanh 1 - VinFast Kim Giang !</p>
         <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
              aria-pressed={activeTab === 'content'}
            >
              <span className="button-icon">✍️</span> Tạo Content Chữ
            </button>
            <button
              className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
              aria-pressed={activeTab === 'image'}
            >
              <span className="button-icon">🖼️</span> Phân Tích Hình Ảnh
            </button>
             <button
              className={`tab-btn ${activeTab === 'tiktok' ? 'active' : ''}`}
              onClick={() => setActiveTab('tiktok')}
              aria-pressed={activeTab === 'tiktok'}
            >
              <span className="button-icon">🎥</span> Tải Video TikTok
            </button>
          </nav>
      </header>
      <main>
        {renderContent()}
      </main>
      <footer>
        <p className="disclaimer">
          <strong>Lưu ý:</strong> Đây là app chuyên về làm content xe Ô tô điện VinFast do Vũ Đức Tâm phát triển, dự án là phi lợi nhuận.
        </p>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
