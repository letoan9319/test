/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseOutfitPreset,
  ColorPalette,
  CostumeFamilyId,
  CostumeItem,
  CulturalSource,
  OccasionId,
  StyleId,
} from '../types';

export const CULTURAL_SOURCES: Record<string, CulturalSource> = {
  src_nguyen_01: {
    id: 'src_nguyen_01',
    title: 'Khảo cứu trang phục triều Nguyễn (1802-1945)',
    authorOrOrg: 'Trung tâm Bảo tồn Di tích Cố đô Huế & Bảo tàng Cổ vật Cung đình Huế',
    sourceType: 'Bảo tàng',
    yearOrPeriod: 'Thế kỷ XIX - đầu thế kỷ XX',
    excerpt: 'Áo ngũ thân tay chẽn có cấu trúc năm thân (bốn thân ngoài bao quanh thân con bên trong), cổ đứng (lập lĩnh) cài năm khuy tượng trưng cho ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) hoặc ngũ luân.',
    detailedArticle: `Áo ngũ thân là đỉnh cao định hình chuẩn mực phục sức của người Việt dưới thời nhà Nguyễn, bắt nguồn từ cuộc cải cách y phục của Chúa Nguyễn Phúc Khoát năm 1744 tại Đàng Trong và được vua Minh Mạng chuẩn hóa trên quy mô toàn quốc vào những năm 1830.

Về mặt kết cấu, áo được ghép từ năm thân vải lụa hoặc đoạn. Bốn thân ngoài gồm hai thân trước và hai thân sau may nối sống lưng, tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng). Thân thứ năm là thân con nằm kín đáo ở phía trong bên phải, che chắn vùng ngực, biểu trưng cho bản thân người mặc luôn được gia đình chở che, nuôi dưỡng. Cổ áo là loại cổ đứng (lập lĩnh) cao từ 3 đến 4 cm, ôm sát gáy, giúp người mặc luôn giữ tư thế ngay ngắn, đĩnh đạc. Năm chiếc khuy cài bằng đồng, ngọc hoặc gỗ quý tượng trưng cho ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín, đồng thời nhắc nhở về ngũ luân trong đạo làm người.

Áo ngũ thân có hai phân nhánh rõ rệt: Áo tay chẽn dùng cho thường nhật, công vụ và sinh hoạt giao tiếp năng động; Áo tấc (tay thụng) có tà tay xòe rộng ngang gối dành riêng cho tế tự, lễ cưới và các nghi điển tôn nghiêm. Việc mặc áo ngũ thân luôn song hành cùng quần lụa mộc buông thụng và khăn đóng (khăn xếp) quấn quanh trán, tạo nên vẻ đẹp đoan trang, kín đáo và thuần hậu của mỹ cảm truyền thống.`,
    url: 'https://hueworldheritage.org.vn',
    verificationStatus: 'Đã đối chiếu tài liệu',
  },
  src_kinh_bac_02: {
    id: 'src_kinh_bac_02',
    title: 'Trang phục cổ truyền người Việt Bắc Bộ',
    authorOrOrg: 'Viện Văn hóa Nghệ thuật Quốc gia Việt Nam',
    sourceType: 'Công trình khảo cứu',
    yearOrPeriod: 'Đồng bằng sông Hồng, thế kỷ XIX-XX',
    excerpt: 'Áo tứ thân gồm bốn thân vải: hai thân sau may nối sống lưng, hai thân trước buông thả hoặc thắt vạt chéo; bên trong mặc áo yếm kín đáo, thắt dải bao xanh hoặc hồng giữ nếp.',
    detailedArticle: `Trang phục tứ thân là biểu tượng sống động nhất của văn hóa dân gian vùng châu thổ Bắc Bộ, đặc biệt gắn liền với các làng quan họ Kinh Bắc và những mùa hội xuân trẩy hội đình chùa.

Cấu trúc áo tứ thân gồm bốn thân vải mộc: hai thân sau may liền ở sống lưng gọi là sống áo, hai thân trước buông lửng tự do. Khi lao động hoặc di chuyển nhanh, phụ nữ thường buộc chéo hai vạt trước ngang eo để tiện thao tác; khi vào hội, vạt áo buông rủ tha thướt theo từng nhịp bước. Trang phục này không cài khuy cố định mà giữ nếp nhờ dải yếm lót bên trong và dải thắt lưng bao quấn ngoài. Chiếc áo yếm cổ xây (thường nhuộm màu cánh sen, hoa đào hoặc lòng tôm) là điểm nhấn ý nhị, vừa kín đáo vừa duyên dáng.

Bên dưới áo tứ thân là chiếc váy lụa sồi đen buông dài chấm mu bàn chân, kết hợp cùng dải bao lụa hồng, xanh thắt gút buông lơi hai đầu. Phụ kiện không thể tách rời là chiếc nón ba tầm (nón quai thao) tròn phẳng đường kính lớn, lợp lá gồi trắng ngà, có hai chùm tua thao thao rủ bên vai. Sự phối hợp giữa sắc áo nâu non hoặc the đen bên ngoài với sắc yếm đào rực rỡ và dải lụa thắt lưng tạo nên một bản hòa sắc tương phản tinh tế, mộc mạc mà lắng đọng tâm hồn làng quê Việt.`,
    verificationStatus: 'Đã đối chiếu tài liệu',
  },
  src_aodai_modern_03: {
    id: 'src_aodai_modern_03',
    title: 'Lịch sử phát triển và biến thiên của Áo dài Việt Nam',
    authorOrOrg: 'Bảo tàng Phụ nữ Việt Nam',
    sourceType: 'Tư liệu lịch sử',
    yearOrPeriod: 'Giai đoạn 1930 đến đương đại',
    excerpt: 'Áo dài kế thừa phom dáng kín đáo từ áo ngũ thân truyền thống, cải tiến chiết eo và tà buông dài qua gối, tôn lên vẻ thanh thoát khi di chuyển.',
    detailedArticle: `Áo dài Việt Nam là một thành tựu dung hợp văn hóa xuất sắc, chuyển biến liên tục trong suốt một thế kỷ qua từ nguồn cội là chiếc áo ngũ thân cung đình và thị dân.

Giai đoạn thập niên 1930 ghi dấu ấn của phong trào cách tân mỹ thuật Đông Dương với các mẫu áo Lemur (họa sĩ Cát Tường) và áo dài Lê Phổ. Các nghệ nhân đã giản lược cấu trúc năm thân xuống còn hai tà trước và sau, đẩy đường xẻ tà lên cao ngang thắt lưng, nhấn nhá đường cong tự nhiên của cơ thể người phụ nữ mà vẫn giữ trọn vẹn vẻ trang nhã. Tiếp đó, vào thập niên 1960, kỹ thuật may tay Raglan (nối xéo từ cổ áo xuống nách) ra đời giúp tà áo ôm khít ngực và vai mà không bị nhăn dúm vải khi giơ tay.

Áo dài đương đại đã trở thành quốc phục trong đời sống học đường, công sở và lễ hội dân tộc. Các biến thể hiện đại ngày nay như cổ tròn mở nhẹ, tà suông thoải mái hay phối cùng chuỗi ngọc tân thời thể hiện tinh thần cởi mở của người trẻ, nhưng luôn kế thừa triết lý thẩm mỹ cốt lõi: kín đáo bên trên, uyển chuyển bên dưới và tôn vinh phong thái khoan thai của người mặc.`,
    url: 'https://baotangphunu.org.vn',
    verificationStatus: 'Đã đối chiếu tài liệu',
  },
  src_phukien_04: {
    id: 'src_phukien_04',
    title: 'Bộ sưu tập nón và khăn truyền thống',
    authorOrOrg: 'Bảo tàng Lịch sử Quốc gia',
    sourceType: 'Bảo tàng',
    yearOrPeriod: 'Tư liệu hiện vật',
    excerpt: 'Nón quai thao (nón ba tầm) thường đi cùng áo tứ thân trong hội làng; nón lá chóp nhọn và khăn đóng/vấn đi kèm áo ngũ thân hoặc áo dài.',
    detailedArticle: `Các phụ kiện đội đầu và cầm tay trong phục sức cổ truyền Việt Nam không chỉ có chức năng che mưa nắng mà còn là dấu hiệu nhận diện văn hóa vùng miền và phong thái ứng xử.

Nón quai thao (nón ba tầm) là kiệt tác đan lát thủ công với vành nón phẳng rộng, khung đan bằng tre cật dẻo dai và lợp lá gồi mỏng, lòng nón có vành tròn ôm khít đỉnh đầu. Quai thao được bện từ sợi tơ tằm nhuộm nâu hoặc điều, hai đầu gắn chùm quả thao buông rủ ngang ngực. Nón lá chóp nhọn lại mang vẻ thanh tú nhỏ gọn, quai nón làm bằng lụa mềm muôn sắc, tạo nên nét duyên e ấp khi sánh đôi cùng tà áo dài xứ Huế và ba miền.

Khăn đóng (khăn xếp) là biểu trưng cho sự chững chạc, chỉnh chu của tầng lớp nho sĩ và quý tộc thời Nguyễn, được quấn từ dải vải đen gấp nhiều nếp quanh trán với hình chữ Nhân (人) hoặc chữ Nhất (一) ở chính giữa. Quạt giấy nan tre dán giấy dó hay giấy điệp mộc mạc cầm tay vừa mang lại sự tiện nghi thoáng mát trong khí hậu nhiệt đới, vừa là vật phẩm giao duyên ý nhị trong văn hóa ứng xử dân gian.`,
    verificationStatus: 'Đã đối chiếu tài liệu',
  },
  src_sangtao_05: {
    id: 'src_sangtao_05',
    title: 'Nguyên tắc bảo tồn và ứng dụng mỹ thuật cổ truyền',
    authorOrOrg: 'Hội đồng Khoa học Di sản Văn hóa Quốc gia',
    sourceType: 'Công trình khảo cứu',
    yearOrPeriod: 'Tài liệu hướng dẫn thực hành văn hóa',
    excerpt: 'Sáng tạo thời trang trên nền di sản cần sự thấu hiểu ranh giới giữa hiện vật lịch sử và cải biên đương đại, tôn trọng tinh thần cốt lõi mà không ngụy tạo niên đại.',
    detailedArticle: `Trong bối cảnh người trẻ ngày càng say mê tìm về cội nguồn thông qua phong trào phục hưng cổ phục, việc xác lập thái độ sáng tạo có ý thức là điều tối quan trọng.

Nếp Việt đề ra ba nguyên tắc ứng xử văn hóa trong ứng dụng:
1. Minh bạch xuất xứ: Khi một bộ phối mô phỏng chính xác hiện vật khảo cổ học hay tư liệu bảo tàng, nó được định danh là 'Tham khảo tư liệu'. Khi có sự tinh giản để thích ứng với nhịp sống học đường, trang phục được định danh là 'Phối đương đại'. Khi kết hợp liên nhóm trang phục theo gu thẩm mỹ cá nhân, trang phục được định danh là 'Phối sáng tạo'.
2. Tôn trọng triết lý cấu trúc: Không tùy tiện lai căng các biểu tượng nghi lễ thiêng liêng hoặc họa tiết ngoại lai không có trong lịch sử tạo hình Đại Việt.
3. Chấp nhận sự đa dạng có căn cứ: Không xem bất kỳ một vùng miền nào là quy chuẩn độc tôn duy nhất của Việt phục, mà đón nhận dòng chảy phong phú của trang phục ba miền qua từng chặng đường lịch sử.`,
    verificationStatus: 'Đã đối chiếu tài liệu',
  },
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'pal_chu_sa',
    name: 'Chu sa trầm',
    description: 'Sắc đỏ son gạch phối lòng tôm và quần lụa mộc, ấm áp và trang nhã.',
    primary: '#9E382B',
    secondary: '#E8C59A',
    accent: '#5E211A',
    bottom: '#F3EDE2',
    harmonyNote: 'Phù hợp không khí trang trọng, lễ hội văn hóa hoặc ngày lễ truyền thống.',
  },
  {
    id: 'pal_thanh_tra',
    name: 'Thanh trà',
    description: 'Tông xanh búp non phối ngọc lam nhạt và quần đen tuyền.',
    primary: '#4D6B53',
    secondary: '#B7CEBE',
    accent: '#2F4835',
    bottom: '#2B2B2B',
    harmonyNote: 'Tạo cảm giác điềm đạm, mát lành cho các dịp dạo phố và tham quan di tích.',
  },
  {
    id: 'pal_may_lam',
    name: 'Mây lam',
    description: 'Sắc lam chàm cổ điển phối cổ trắng tuyết và quần lụa ngà.',
    primary: '#354E6B',
    secondary: '#A8BED6',
    accent: '#1D2F45',
    bottom: '#EDE8DF',
    harmonyNote: 'Thanh lịch và chuẩn mực cho chụp ảnh kỷ yếu học đường.',
  },
  {
    id: 'pal_to_nu',
    name: 'Tố nữ',
    description: 'Sắc trắng mộc phối viền chỉ sen và quần lụa đen truyền thống.',
    primary: '#EBE5D8',
    secondary: '#C47265',
    accent: '#7D6A58',
    bottom: '#1F1E1C',
    harmonyNote: 'Tối giản, tôn lên tối đa phom dáng và đường cắt may của trang phục.',
  },
  {
    id: 'pal_gam_hoang',
    name: 'Gấm hoàng',
    description: 'Sắc vàng nghệ cung đình phối lót nâu trầm và dải thắt son.',
    primary: '#B88232',
    secondary: '#ECD09F',
    accent: '#8C382A',
    bottom: '#F2EBDC',
    harmonyNote: 'Nổi bật, rực rỡ nhưng giữ được nét trầm mặc của gam màu tự nhiên.',
  },
  {
    id: 'pal_cham_suong',
    name: 'Chàm sương',
    description: 'Sắc xám khói hòa tím than nhẹ, gợi cảm giác hoài cổ thanh tao.',
    primary: '#5C5468',
    secondary: '#CCC4D6',
    accent: '#393342',
    bottom: '#E8E3DA',
    harmonyNote: 'Nhẹ nhàng và kín đáo, thích hợp không gian hoài niệm.',
  },
];

export const COSTUME_ITEMS: CostumeItem[] = [
  // --- ÁO (TOPS) ---
  {
    id: 'top_ngu_than_chen',
    familyId: 'ao_ngu_than',
    name: 'Áo ngũ thân lập lĩnh tay chẽn',
    slot: 'top',
    description: 'Phom áo năm thân kín đáo, cổ đứng cao 3-4 cm ôm sát gáy, năm khuy cài bên phải, tay may thu nhỏ dần về cổ tay.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Dựa trên tư liệu trang phục thường nhật thời Nguyễn. Thân con bên trong tượng trưng cho lòng che chở.',
    sourceIds: ['src_nguyen_01'],
    compatibleWith: ['ao_ngu_than'],
    isRemovable: false,
  },
  {
    id: 'top_ngu_than_thung',
    familyId: 'ao_ngu_than',
    name: 'Áo ngũ thân tay thụng (Áo tấc)',
    slot: 'top',
    description: 'Biến thể tay rộng thụng chấm gối, tà xòe rộng trang nghiêm dùng trong tế tự, lễ phục và dịp trọng đại.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Áo tấc mang vẻ tôn nghiêm, khi cử lễ hai tay chấp trước ngực để tà tay buông rủ cân đối.',
    sourceIds: ['src_nguyen_01'],
    compatibleWith: ['ao_ngu_than'],
    isRemovable: false,
  },
  {
    id: 'top_aodai_truyenthong',
    familyId: 'ao_dai',
    name: 'Áo dài hai tà truyền thống',
    slot: 'top',
    description: 'Áo dài cổ đứng cao vừa phải, hai tà trước sau buông dài quá gối, thân trên ôm vừa vặn tạo dáng vẻ thanh thoát.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Phát triển từ phom áo ngũ thân, kế thừa vẻ kín đáo và tôn dáng trang nhã.',
    sourceIds: ['src_aodai_modern_03'],
    compatibleWith: ['ao_dai'],
    isRemovable: false,
  },
  {
    id: 'top_aodai_cachtan',
    familyId: 'ao_dai',
    name: 'Áo dài tà đôi suông mềm',
    slot: 'top',
    description: 'Phom tà suông nhẹ nhàng hơn, cổ tròn thanh thoát, phối hợp đương đại cho sự thoải mái khi di chuyển.',
    culturalLabel: 'Phối đương đại',
    culturalNote: 'Cải biên hiện đại giữ nguyên độ rủ của tà áo nhưng mở rộng cổ áo giúp dễ mặc trong sinh hoạt thường nhật.',
    sourceIds: ['src_aodai_modern_03'],
    compatibleWith: ['ao_dai'],
    isRemovable: false,
  },
  {
    id: 'top_tu_than_kinhbac',
    familyId: 'ao_tu_than',
    name: 'Áo tứ thân Kinh Bắc truyền thống',
    slot: 'top',
    description: 'Bộ áo tứ thân gồm áo cánh ngoài buông vạt, bên trong mặc yếm cổ xây kín đáo, dải lưng buông nhẹ.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Bốn thân áo biểu trưng cho tứ thân phụ mẫu (bố mẹ đẻ và bố mẹ chồng). Điển hình trang phục trẩy hội miền Bắc.',
    sourceIds: ['src_kinh_bac_02'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: false,
  },
  {
    id: 'top_tu_than_cachdieuviet',
    familyId: 'ao_tu_than',
    name: 'Áo tứ thân vạt buộc cách điệu',
    slot: 'top',
    description: 'Vạt trước buộc nút mềm mại ngang eo, áo ngoài chất liệu đũi nhẹ nhàng tạo phong cách trẻ trung.',
    culturalLabel: 'Phối sáng tạo',
    culturalNote: 'Buộc hai vạt trước là cách vận đồ năng động khi lao động hoặc dự hội của phụ nữ Bắc Bộ xưa.',
    sourceIds: ['src_kinh_bac_02'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: false,
  },

  // --- QUẦN & VÁY (BOTTOMS) ---
  {
    id: 'bot_quan_lua_trang',
    familyId: 'ao_dai',
    name: 'Quần lụa ống rộng màu trắng ngà',
    slot: 'bottom',
    description: 'Quần lụa buông thẳng rộng rãi, gấu chấm mu bàn chân, chuyển động nhịp nhàng theo tà áo.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Quần lụa mộc hoặc trắng ngà là phối bản phổ biến nhất của Áo dài và Áo ngũ thân nữ.',
    sourceIds: ['src_aodai_modern_03'],
    compatibleWith: ['ao_dai', 'ao_ngu_than'],
    isRemovable: false,
  },
  {
    id: 'bot_quan_lua_den',
    familyId: 'ao_ngu_than',
    name: 'Quần lụa đen tuyền truyền thống',
    slot: 'bottom',
    description: 'Quần đen nhuộm truyền thống, phom thụng rộng thoải mái, giữ vẻ chững chạc và cổ điển.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Quần đen là trang phục kinh điển trong cả phong cách Bắc Bộ lẫn ngũ thân thường phục.',
    sourceIds: ['src_nguyen_01', 'src_kinh_bac_02'],
    compatibleWith: ['ao_ngu_than', 'ao_tu_than', 'ao_dai'],
    isRemovable: false,
  },
  {
    id: 'bot_vay_xoe_den',
    familyId: 'ao_tu_than',
    name: 'Váy lụa sồi buông dài chấm gót',
    slot: 'bottom',
    description: 'Váy đen quấn quanh eo, che kín chân, kết hợp cùng dải yếm và áo tứ thân tạo tỷ lệ hài hòa.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Váy sồi đen đi liền với trang phục dân gian Bắc Bộ từ nhiều thế kỷ.',
    sourceIds: ['src_kinh_bac_02'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: false,
  },

  // --- THẮT LƯNG / DẢI BAO (SASH) ---
  {
    id: 'sash_dai_bao_lua',
    familyId: 'ao_tu_than',
    name: 'Dải thắt lưng bao lụa hồng hoa',
    slot: 'sash',
    description: 'Dải bao bằng lụa mềm thắt quanh eo, hai đầu dải buông rủ phía trước làm điểm nhấn màu sắc.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Dải thắt lưng bao vừa giữ chặt yếm và váy, vừa là điểm nhấn rực rỡ của bộ tứ thân trẩy hội.',
    sourceIds: ['src_kinh_bac_02'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: true,
  },
  {
    id: 'sash_that_lung_goi',
    familyId: 'ao_tu_than',
    name: 'Dải thắt lưng xanh hòa sắc',
    slot: 'sash',
    description: 'Dải thắt lưng lụa xanh nhẹ nhàng, tạo độ chuyển tiếp giữa áo ngoài và váy trong.',
    culturalLabel: 'Phối đương đại',
    culturalNote: 'Phối màu tinh tế cho sự kiện thanh lịch ngoài trời.',
    sourceIds: ['src_kinh_bac_02'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: true,
  },

  // --- PHỤ KIỆN ĐẦU (HEADWEAR) ---
  {
    id: 'head_khan_dong',
    familyId: 'ao_ngu_than',
    name: 'Khăn đóng xếp nếp truyền thống',
    slot: 'headwear',
    description: 'Khăn đóng bọc gấm hoặc lụa đen/xanh với các nếp xếp đều đặn quanh trán, tạo vẻ đĩnh đạc.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Khăn đóng (khăn xếp) là phụ kiện quy chuẩn khi mặc áo ngũ thân trong nghi lễ và giao tiếp quan trọng.',
    sourceIds: ['src_nguyen_01', 'src_phukien_04'],
    compatibleWith: ['ao_ngu_than', 'ao_dai'],
    isRemovable: true,
  },
  {
    id: 'head_non_la',
    familyId: 'ao_dai',
    name: 'Nón lá truyền thống quai lụa',
    slot: 'headwear',
    description: 'Nón lá chóp nhọn đan từ lá nón thanh mảnh, quai lụa tơ tằm mềm mại giữ nón nhẹ nhàng.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Hình ảnh nón lá quai lụa song hành cùng chiếc áo dài đã trở thành biểu trưng thẩm mỹ thân thuộc.',
    sourceIds: ['src_phukien_04'],
    compatibleWith: ['ao_dai', 'ao_ngu_than'],
    isRemovable: true,
  },
  {
    id: 'head_non_quai_thao',
    familyId: 'ao_tu_than',
    name: 'Nón ba tầm (Nón quai thao)',
    slot: 'headwear',
    description: 'Nón tròn phẳng đường kính lớn, lợp lá gồi, có quai thao buông hai chùm tua mềm mại.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Vật dụng gắn liền với liền chị quan họ Kinh Bắc khi trẩy hội mùa xuân.',
    sourceIds: ['src_kinh_bac_02', 'src_phukien_04'],
    compatibleWith: ['ao_tu_than'],
    isRemovable: true,
  },
  {
    id: 'head_tram_cai_ngoc',
    familyId: 'ao_dai',
    name: 'Trâm cài tóc khảm xà cừ',
    slot: 'headwear',
    description: 'Trâm cài tóc thủ công bằng gỗ trầm khảm xà cừ đơn giản, giữ búi tóc gọn gàng.',
    culturalLabel: 'Phối đương đại',
    culturalNote: 'Mang nét hoài cổ nhẹ nhàng, phù hợp không gian chụp ảnh kỷ yếu thanh nhã.',
    sourceIds: ['src_phukien_04'],
    compatibleWith: ['ao_dai', 'ao_ngu_than', 'ao_tu_than'],
    isRemovable: true,
  },

  // --- PHỤ KIỆN TAY (HANDHELD) ---
  {
    id: 'hand_quat_tranh',
    familyId: 'ao_ngu_than',
    name: 'Quạt giấy nan tre vẽ thủy mặc',
    slot: 'handheld',
    description: 'Quạt nan tre dán giấy dó thủ công mộc mạc, điểm hoa sen trầm mặc.',
    culturalLabel: 'Tham khảo tư liệu',
    culturalNote: 'Phụ kiện cầm tay phổ biến của cả nam và nữ trí thức xưa, vừa làm mát vừa tạo dáng đĩnh đạc.',
    sourceIds: ['src_nguyen_01'],
    compatibleWith: ['ao_ngu_than', 'ao_dai', 'ao_tu_than'],
    isRemovable: true,
  },
  {
    id: 'hand_chuoi_ngoc',
    familyId: 'ao_dai',
    name: 'Chuỗi hạt đeo cổ thanh nhã',
    slot: 'handheld',
    description: 'Vòng cổ chuỗi ngọc trắng ngà một hàng hạt tròn, buông nhẹ trước ngực áo.',
    culturalLabel: 'Phối đương đại',
    culturalNote: 'Thịnh hành từ đầu thế kỷ XX trong giới thị dân tân thời khi diện áo dài trang trọng.',
    sourceIds: ['src_aodai_modern_03'],
    compatibleWith: ['ao_dai', 'ao_ngu_than'],
    isRemovable: true,
  },
  {
    id: 'hand_tui_gam',
    familyId: 'ao_tu_than',
    name: 'Túi gấm thêu tay miệng rút',
    slot: 'handheld',
    description: 'Túi nhỏ đựng đồ may bằng gấm hoa sen, dây rút treo tua chỉ đồng điệu.',
    culturalLabel: 'Phối đương đại',
    culturalNote: 'Phụ kiện bổ trợ tiện dụng cho các bạn trẻ khi tham quan di tích cổ.',
    sourceIds: ['src_phukien_04'],
    compatibleWith: ['ao_tu_than', 'ao_ngu_than', 'ao_dai'],
    isRemovable: true,
  },
];

export const BASE_OUTFIT_PRESETS: Record<CostumeFamilyId, BaseOutfitPreset> = {
  ao_ngu_than: {
    id: 'preset_ngu_than_chuan',
    familyId: 'ao_ngu_than',
    name: 'Ngũ Thân Lập Lĩnh Cố Đô',
    subtitle: 'Năm thân đoan chính, khuy ngọc tay chẽn',
    eraContext: 'Thời Nguyễn (Thế kỷ XIX-XX)',
    description: 'Bộ cổ phục chuẩn mực với áo ngũ thân tay chẽn kín đáo, quần lụa mộc, quạt nan tre và khăn đóng truyền thống.',
    items: {
      topId: 'top_ngu_than_chen',
      bottomId: 'bot_quan_lua_trang',
      headwearId: 'head_khan_dong',
      handheldId: 'hand_quat_tranh',
    },
    defaultPaletteId: 'pal_cham_suong',
    sourceIds: ['src_nguyen_01', 'src_phukien_04'],
  },
  ao_dai: {
    id: 'preset_aodai_than_thanh',
    familyId: 'ao_dai',
    name: 'Áo Dài Thanh Tao',
    subtitle: 'Tà đôi tha thướt, nón lá quai lụa',
    eraContext: 'Truyền thống phát triển qua các thời kỳ',
    description: 'Bộ áo dài cổ đứng hai tà rủ mềm, quần lụa ngà và nón lá duyên dáng, thích hợp kỷ yếu và ngày hội thanh xuân.',
    items: {
      topId: 'top_aodai_truyenthong',
      bottomId: 'bot_quan_lua_trang',
      headwearId: 'head_non_la',
      handheldId: 'hand_chuoi_ngoc',
    },
    defaultPaletteId: 'pal_may_lam',
    sourceIds: ['src_aodai_modern_03', 'src_phukien_04'],
  },
  ao_tu_than: {
    id: 'preset_tu_than_kinh_bac',
    familyId: 'ao_tu_than',
    name: 'Tứ Thân Trẩy Hội Kinh Bắc',
    subtitle: 'Áo lụa buông vạt, nón quai thao trẩy hội',
    eraContext: 'Văn hóa dân gian Đồng bằng Bắc Bộ',
    description: 'Trang phục truyền thống vùng Kinh Bắc với áo tứ thân, váy lụa sồi đen, dải thắt lưng bao hồng và nón ba tầm.',
    items: {
      topId: 'top_tu_than_kinhbac',
      bottomId: 'bot_vay_xoe_den',
      sashId: 'sash_dai_bao_lua',
      headwearId: 'head_non_quai_thao',
      handheldId: 'hand_quat_tranh',
    },
    defaultPaletteId: 'pal_chu_sa',
    sourceIds: ['src_kinh_bac_02', 'src_phukien_04'],
  },
};

export const OCCASIONS: { id: OccasionId; name: string; description: string }[] = [
  { id: 'ky_yeu', name: 'Chụp kỷ yếu', description: 'Tôn vinh nét thanh lịch học đường, màu sắc trang nhã, phom dáng gọn gàng.' },
  { id: 'ngay_hoi', name: 'Ngày hội văn hóa', description: 'Đậm đà bản sắc, điểm nhấn nổi bật, tôn vinh giá trị cội nguồn.' },
  { id: 'du_xuan', name: 'Du xuân lễ hội', description: 'Tươi vui, ấm áp, kết hợp linh hoạt phụ kiện cầm tay và che nắng.' },
  { id: 'tham_quan', name: 'Tham quan di tích', description: 'Lịch thiệp, tôn kính không gian lịch sử, dễ chịu khi tản bộ.' },
];

export const STYLES: { id: StyleId; name: string; description: string }[] = [
  { id: 'nhe_nhang', name: 'Nhẹ nhàng', description: 'Màu phấn dịu, chất vải mềm, phụ kiện mộc mạc.' },
  { id: 'toi_gian', name: 'Tối giản', description: 'Đường nét khúc chiết, sắc độ đơn sắc hoặc tương phản cao.' },
  { id: 'noi_bat', name: 'Nổi bật', description: 'Sắc thắm chu sa, gấm hoàng, dải thắt lưng tương phản sống động.' },
];
