#define PI 3.1415926535

float powFast(float a, float b) {
  return a / ((1. - b) * a + b);
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 fluidShading(vec3 V, vec3 N, vec3 position, float zoom, sampler2D envMapTex) {
  // 1. Tính toán Vector Phản Xạ 
  vec3 R = reflect(-V, N); 

  // 2. Định nghĩa màu sắc 
  vec3 baseBlack = vec3(0.01, 0.01, 0.01); 
  vec3 luxGold = vec3(1.0, 0.65, 0.15);    

  // 3. GIẢ LẬP PHÒNG STUDIO 
  float whitePanel1 = smoothstep(0.90, 0.95, dot(R, normalize(vec3(1.0, 0.8, 0.5))));
  float whitePanel2 = smoothstep(0.92, 0.96, dot(R, normalize(vec3(-1.0, 0.5, -0.8))));
  float whitePanel3 = smoothstep(0.95, 0.98, dot(R, normalize(vec3(0.0, 1.0, 0.5))));

  float goldPanel = smoothstep(0.94, 0.97, dot(R, normalize(vec3(-0.5, -0.2, 1.0))));

  float floorReflection = smoothstep(0.0, -0.6, R.y) * 0.9; 

  // 4. Tổng hợp môi trường phản chiếu
  vec3 sharpReflections = 
        (max(whitePanel1, max(whitePanel2, whitePanel3)) * vec3(1.5)) 
      + (goldPanel * luxGold * 2.0)                                   
      + (floorReflection * vec3(1.0));                                

  // 5. Fresnel (Tạo độ nổi khối ở viền ngoài cùng - Rất mỏng)
  float fresnel = powFast(max(1.0 - dot(N, V), 0.0), 8.0);
  vec3 rimLight = fresnel * vec3(1.0) * 0.4; 

  // 6. Output cuối cùng (Chỉ gồm màu đen + hình ảnh phản chiếu)
  vec3 color = baseBlack + sharpReflections + rimLight;

  // Đảm bảo không vượt quá hệ màu hiển thị
  color = clamp(color, 0.0, 1.0);

  return color;
}