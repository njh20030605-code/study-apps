/* ===== formulas.js 公式记忆库 =====
   每张卡：id / group / name(中文提示,正面) / latex(公式,背面) / example(例子) / level
   你可以照着往下加，group 用于分组浏览。 */
window.FORMULAS = [
  // ---------- 导数公式 ----------
  { id: 'd01', group: '导数', level: 2, name: 'x 的 n 次方的导数', latex: "(x^{n})' = n x^{n-1}", example: "$(x^3)' = 3x^2$" },
  { id: 'd02', group: '导数', level: 2, name: '常数的导数', latex: "(C)' = 0", example: "$(5)' = 0$" },
  { id: 'd03', group: '导数', level: 2, name: 'e 的 x 次方的导数', latex: "(e^{x})' = e^{x}", example: "自己是自己的导数" },
  { id: 'd04', group: '导数', level: 2, name: 'a 的 x 次方的导数', latex: "(a^{x})' = a^{x}\\ln a", example: "$(2^x)'=2^x\\ln 2$" },
  { id: 'd05', group: '导数', level: 2, name: '自然对数的导数', latex: "(\\ln x)' = \\dfrac{1}{x}", example: "" },
  { id: 'd06', group: '导数', level: 2, name: '正弦的导数', latex: "(\\sin x)' = \\cos x", example: "" },
  { id: 'd07', group: '导数', level: 2, name: '余弦的导数', latex: "(\\cos x)' = -\\sin x", example: "注意有个负号" },
  { id: 'd08', group: '导数', level: 3, name: '正切的导数', latex: "(\\tan x)' = \\sec^2 x = \\dfrac{1}{\\cos^2 x}", example: "" },
  { id: 'd09', group: '导数', level: 3, name: '反正切的导数', latex: "(\\arctan x)' = \\dfrac{1}{1+x^2}", example: "" },
  { id: 'd10', group: '导数', level: 3, name: '两个函数相乘求导（乘积法则）', latex: "(uv)' = u'v + uv'", example: "$(x e^x)' = e^x + x e^x$" },
  { id: 'd11', group: '导数', level: 3, name: '两个函数相除求导（商法则）', latex: "\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}", example: "" },
  { id: 'd12', group: '导数', level: 3, name: '复合函数求导（链式法则）', latex: "[f(g(x))]' = f'(g(x))\\cdot g'(x)", example: "$(\\sin 2x)'=2\\cos 2x$" },

  // ---------- 基本积分表 ----------
  { id: 'i01', group: '积分', level: 2, name: 'x 的 n 次方的积分', latex: "\\int x^{n}\\,dx = \\dfrac{x^{n+1}}{n+1}+C\\ (n\\neq-1)", example: "$\\int x^2 dx=\\frac{x^3}{3}+C$" },
  { id: 'i02', group: '积分', level: 2, name: '1/x 的积分', latex: "\\int \\dfrac{1}{x}\\,dx = \\ln|x|+C", example: "别忘绝对值" },
  { id: 'i03', group: '积分', level: 2, name: 'e 的 x 次方的积分', latex: "\\int e^{x}\\,dx = e^{x}+C", example: "" },
  { id: 'i04', group: '积分', level: 2, name: '正弦的积分', latex: "\\int \\sin x\\,dx = -\\cos x + C", example: "有负号" },
  { id: 'i05', group: '积分', level: 2, name: '余弦的积分', latex: "\\int \\cos x\\,dx = \\sin x + C", example: "" },
  { id: 'i06', group: '积分', level: 3, name: '常数的积分', latex: "\\int a\\,dx = a x + C", example: "$\\int 3\\,dx=3x+C$" },
  { id: 'i07', group: '积分', level: 3, name: '分部积分公式', latex: "\\int u\\,dv = uv - \\int v\\,du", example: "$\\int \\ln x\\,dx=x\\ln x-x+C$" },
  { id: 'i08', group: '积分', level: 3, name: '1/(1+x^2) 的积分', latex: "\\int \\dfrac{1}{1+x^2}\\,dx = \\arctan x + C", example: "" },
  { id: 'i09', group: '积分', level: 3, name: '牛顿-莱布尼茨公式（定积分）', latex: "\\int_a^b f(x)\\,dx = F(b)-F(a)", example: "F 是 f 的原函数" },
  { id: 'i10', group: '积分', level: 3, name: '奇函数在对称区间的定积分', latex: "\\int_{-a}^{a} f(x)\\,dx = 0\\ (f\\text{ 为奇函数})", example: "考试常用技巧" },

  // ---------- 极限 / 等价无穷小 ----------
  { id: 'l01', group: '极限', level: 2, name: '第一重要极限', latex: "\\lim_{x\\to 0}\\dfrac{\\sin x}{x} = 1", example: "" },
  { id: 'l02', group: '极限', level: 3, name: '第二重要极限', latex: "\\lim_{x\\to\\infty}\\left(1+\\dfrac{1}{x}\\right)^{x} = e", example: "凑成 (1+1/□)^□ 形" },
  { id: 'l03', group: '极限', level: 3, name: '等价无穷小：sin x', latex: "\\sin x \\sim x\\ (x\\to0)", example: "" },
  { id: 'l04', group: '极限', level: 3, name: '等价无穷小：tan x', latex: "\\tan x \\sim x\\ (x\\to0)", example: "" },
  { id: 'l05', group: '极限', level: 3, name: '等价无穷小：arctan x', latex: "\\arctan x \\sim x\\ (x\\to0)", example: "" },
  { id: 'l06', group: '极限', level: 3, name: '等价无穷小：1-cos x', latex: "1-\\cos x \\sim \\dfrac{1}{2}x^2\\ (x\\to0)", example: "" },
  { id: 'l07', group: '极限', level: 3, name: '等价无穷小：e^x-1', latex: "e^{x}-1 \\sim x\\ (x\\to0)", example: "" },
  { id: 'l08', group: '极限', level: 3, name: '等价无穷小：ln(1+x)', latex: "\\ln(1+x) \\sim x\\ (x\\to0)", example: "" },
  { id: 'l09', group: '极限', level: 4, name: '洛必达法则（0/0 或 ∞/∞）', latex: "\\lim\\dfrac{f}{g} = \\lim\\dfrac{f'}{g'}", example: "上下同时求导" },
  { id: 'l10', group: '极限', level: 2, name: '有界量 × 无穷小 = 0', latex: "\\text{有界}\\times\\text{无穷小}\\to 0", example: "如 $\\frac{\\arctan x}{x}\\ (x\\to\\infty)$" },

  // ---------- 三角恒等式 ----------
  { id: 't01', group: '三角', level: 1, name: '平方关系', latex: "\\sin^2 x + \\cos^2 x = 1", example: "最常用" },
  { id: 't02', group: '三角', level: 2, name: '二倍角正弦', latex: "\\sin 2x = 2\\sin x\\cos x", example: "" },
  { id: 't03', group: '三角', level: 2, name: '二倍角余弦', latex: "\\cos 2x = \\cos^2 x - \\sin^2 x = 1-2\\sin^2 x", example: "" },
  { id: 't04', group: '三角', level: 1, name: '正切定义', latex: "\\tan x = \\dfrac{\\sin x}{\\cos x}", example: "" },
  { id: 't05', group: '三角', level: 1, name: '特殊角正弦', latex: "\\sin 0=0,\\ \\sin\\tfrac{\\pi}{6}=\\tfrac12,\\ \\sin\\tfrac{\\pi}{2}=1", example: "" },
  { id: 't06', group: '三角', level: 1, name: '特殊角余弦', latex: "\\cos 0=1,\\ \\cos\\tfrac{\\pi}{3}=\\tfrac12,\\ \\cos\\tfrac{\\pi}{2}=0", example: "" },

  // ---------- 函数 / 图像性质 ----------
  { id: 'f01', group: '函数', level: 1, name: '指数运算：同底相乘', latex: "a^{m}\\cdot a^{n} = a^{m+n}", example: "$2^3\\cdot2^2=2^5$" },
  { id: 'f02', group: '函数', level: 1, name: '指数运算：幂的幂', latex: "(a^{m})^{n} = a^{mn}", example: "" },
  { id: 'f03', group: '函数', level: 1, name: '对数换算', latex: "\\log_a(MN)=\\log_a M+\\log_a N", example: "" },
  { id: 'f04', group: '函数', level: 1, name: '负指数 / 分数指数', latex: "a^{-n}=\\dfrac{1}{a^{n}},\\quad a^{1/2}=\\sqrt{a}", example: "$x^{-1}=\\frac1x$" },
  { id: 'f05', group: '函数', level: 2, name: '奇函数 / 偶函数', latex: "f(-x)=-f(x)\\text{ 奇};\\ f(-x)=f(x)\\text{ 偶}", example: "奇函数图像关于原点对称" },
  { id: 'f06', group: '函数', level: 3, name: '极值判定（一阶导变号）', latex: "f'(x_0)=0,\\ f'\\text{由正变负}\\Rightarrow\\text{极大}", example: "由负变正为极小" },
  { id: 'f07', group: '函数', level: 3, name: '凹凸与拐点（二阶导）', latex: "f''>0\\text{ 凹};\\ f''<0\\text{ 凸};\\ f''=0\\text{ 处变号为拐点}", example: "" },
  { id: 'f08', group: '函数', level: 3, name: '单调性（一阶导符号）', latex: "f'>0\\text{ 增};\\quad f'<0\\text{ 减}", example: "" },

  // ---------- 多元函数 ----------
  { id: 'm01', group: '多元', level: 3, name: '偏导数 ∂z/∂x', latex: "\\dfrac{\\partial z}{\\partial x}:\\ \\text{把 }y\\text{ 看成常数对 }x\\text{ 求导}", example: "" },
  { id: 'm02', group: '多元', level: 3, name: '全微分', latex: "dz = \\dfrac{\\partial z}{\\partial x}dx + \\dfrac{\\partial z}{\\partial y}dy", example: "" },

  // ---------- 概率 ----------
  { id: 'p01', group: '概率', level: 3, name: '古典概率', latex: "P = \\dfrac{\\text{有利结果数}}{\\text{总结果数}}", example: "" },
  { id: 'p02', group: '概率', level: 3, name: '组合数', latex: "C_n^k = \\dfrac{n!}{k!(n-k)!}", example: "$C_5^2=10$" }
];
