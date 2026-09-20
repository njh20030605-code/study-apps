/* ============================================================================
 * data-extra.js —— 扩展数据，按词 id 挂到 WORDS 上
 *   ipa    音标（来源：dictionaryapi.dev / Wiktionary，多词短语由成分词拼接）
 *   say    给语音合成的读法提示（缩写要按字母读，不然会被读成一个怪词）
 *   senses 多个词性的不同意思（v. / n. / adj. 分开）
 *   more   举一反三：同根词、常见搭配、易混对比
 * ==========================================================================*/
window.EXTRA = {
/* ---- 广告投放 ---- */
w001:{senses:[{pos:"n.",zh:"预算（能花的钱）"},{pos:"v.",zh:"做预算、把钱分配好"}],more:[
 {en:"daily budget / total budget",zh:"日预算 / 总预算"},
 {en:"raise the budget · cut the budget",zh:"加预算 · 砍预算"},
 {en:"We're over budget.",zh:"超预算了"},
 {en:"budget cap",zh:"预算上限"}]},
w002:{senses:[{pos:"n.",zh:"消耗（花掉的钱）"},{pos:"v.",zh:"花（钱）"}],more:[
 {en:"spend · spent · spent",zh:"过去式和过去分词同形"},
 {en:"How much did we spend today?",zh:"今天花了多少"},
 {en:"overspend",zh:"超花 / 花超了"},
 {en:"spending is flat",zh:"消耗没变化"}]},
w003:{more:[
 {en:"a creative · creatives",zh:"可数：一条素材 / 多条素材"},
 {en:"top creative · low-quality creative",zh:"头部素材 · 差素材"},
 {en:"creative refresh",zh:"素材换新"},
 {en:"creative fatigue",zh:"素材衰退（跑久了效果下滑）"}]},
w004:{more:[
 {en:"exclude · exclusion",zh:"动词 / 名词"},
 {en:"exclude a creator",zh:"排除达人"},
 {en:"include vs exclude",zh:"纳入 vs 排除"},
 {en:"excluding refunds",zh:"不含退款（讲口径时常用）"}]},
w005:{more:[
 {en:"add / remove the promo code",zh:"加码 / 撤码"},
 {en:"The code is invalid.",zh:"这个码失效了"},
 {en:"authorized code",zh:"已授权的码"}]},
w006:{more:[
 {en:"exit the learning phase",zh:"跑出学习期"},
 {en:"It's still learning.",zh:"还在学习期"},
 {en:"re-enter the learning phase",zh:"重新进入学习期"}]},
w007:{say:"burn budget",more:[
 {en:"burn through the budget",zh:"把预算烧穿"},
 {en:"a runaway creative",zh:"一条跑飞的素材"},
 {en:"It's overspending.",zh:"它在超花"}]},
w008:{senses:[{pos:"n.",zh:"投放（广告在跑）"},{pos:"n.",zh:"配送（物流场景）"}],more:[
 {en:"delivery stopped",zh:"断流了"},
 {en:"steady delivery",zh:"跑量平稳"},
 {en:"⚠️ delivery time = 物流时效，不是投放时长",zh:"同词两义，靠上下文分"}]},
w009:{say:"brand ads",more:[
 {en:"brand ads vs performance ads",zh:"品牌广告 vs 效果广告"},
 {en:"upper funnel · lower funnel",zh:"上漏斗 · 下漏斗"},
 {en:"brand lift",zh:"品牌提升"}]},
w010:{more:[
 {en:"audience package",zh:"人群包"},
 {en:"audience overlap",zh:"人群重叠"},
 {en:"broad audience · lookalike audience",zh:"泛人群 · 相似人群"}]},
w011:{more:[
 {en:"scale up vs scale down",zh:"放量 vs 收量"},
 {en:"It can't scale.",zh:"这个起不了量"},
 {en:"scale it gradually",zh:"慢慢放"}]},
w012:{senses:[{pos:"v.",zh:"充值"},{pos:"n.",zh:"一次充值（写作 top-up）"}],more:[
 {en:"top up the account",zh:"给账户充值"},
 {en:"The top-up hasn't landed yet.",zh:"充值还没到账"}]},
w013:{more:[
 {en:"running low on balance",zh:"余额快不够了"},
 {en:"The balance hit zero.",zh:"余额见底了"},
 {en:"balance can last 4 days",zh:"余额还够花 4 天"}]},
w014:{more:[
 {en:"in-feed placement",zh:"信息流版位"},
 {en:"search placement",zh:"搜索版位"},
 {en:"⚠️ placement ≠ ranking",zh:"版位不是排名"}]},
w015:{say:"ad group",more:[
 {en:"campaign > ad group > ad",zh:"投放三层结构"},
 {en:"duplicate the ad group",zh:"复制广告组"},
 {en:"ad group ID",zh:"广告组 ID"}]},
w016:{more:[
 {en:"launch a campaign",zh:"开一个推广系列"},
 {en:"campaign objective",zh:"推广目标"},
 {en:"always-on campaign",zh:"常态化投放"}]},
w017:{senses:[{pos:"n.",zh:"出价"},{pos:"v.",zh:"出价、竞价"}],more:[
 {en:"raise the bid",zh:"提高出价"},
 {en:"NoBid",zh:"不出价（智能投放）"},
 {en:"bid cap",zh:"出价上限"}]},
w018:{ipa:"/ˈtɑːr.ɡɪ.tɪŋ/",more:[
 {en:"broad targeting",zh:"放开定向"},
 {en:"narrow the targeting",zh:"收窄定向"},
 {en:"interest targeting",zh:"兴趣定向"}]},
w019:{ipa:"/ˈwaɪt.lɪst/",senses:[{pos:"n.",zh:"白名单"},{pos:"v.",zh:"加白"}],more:[
 {en:"whitelist vs blacklist",zh:"白名单 vs 黑名单"},
 {en:"Whitelist this creator.",zh:"把这个达人加白"}]},
w020:{senses:[{pos:"v.",zh:"暂停（不删除）"},{pos:"n.",zh:"暂停状态"}],more:[
 {en:"pause vs delete",zh:"暂停（可恢复）vs 删除（不可恢复）"},
 {en:"resume it",zh:"重新开启"},
 {en:"It's paused.",zh:"它是暂停状态"}]},
/* ---- 数据指标 ---- */
w021:{ipa:"/ˌɑːr oʊ ˈaɪ/",say:"R O I",more:[
 {en:"ROI = ROAS",zh:"这行里两个词常混用"},
 {en:"ROI under one · ROI above two",zh:"ROI 低于 1 · 高于 2"},
 {en:"breakeven ROI",zh:"保本 ROI"}]},
w022:{ipa:"/ˌdʒiː em ˈviː/",say:"G M V",more:[
 {en:"GMV vs NMV",zh:"含退款 vs 不含退款"},
 {en:"GMV Max",zh:"平台的智能投放产品名"},
 {en:"drive GMV",zh:"拉成交"}]},
w023:{ipa:"/ˌen em ˈviː/",say:"N M V",more:[
 {en:"NMV = GMV − refunds",zh:"净成交的算法"},
 {en:"Which one — GMV or NMV?",zh:"你说的是哪个口径"}]},
w024:{senses:[{pos:"n.",zh:"口径（数怎么算的）"},{pos:"n.",zh:"依据、基础"}],more:[
 {en:"on what basis?",zh:"按什么口径 / 依据什么"},
 {en:"same basis · different basis",zh:"同口径 · 不同口径"},
 {en:"one shop, one basis",zh:"1 店 1 口径"}]},
w025:{ipa:"/ˌæt.rɪˈbjuː.ʃən/",more:[
 {en:"7-day attribution window",zh:"7 天归因窗口"},
 {en:"last-click attribution",zh:"末次点击归因"},
 {en:"attribution gap",zh:"归因差异"}]},
w026:{say:"refund rate",more:[
 {en:"refund rate vs return rate",zh:"退款率（钱）vs 退货率（货）"},
 {en:"The refund rate is climbing.",zh:"退款率在涨"}]},
w027:{ipa:"/ˌsiː tiː ˈɑːr/",say:"C T R",more:[
 {en:"CTR = clicks ÷ impressions",zh:"点击率的算法"},
 {en:"CTR dropped · CTR is holding",zh:"点击率掉了 · 稳住了"}]},
w028:{ipa:"/ˌsiː piː ˈem/",say:"C P M",more:[
 {en:"CPM is rising = traffic is getting expensive",zh:"千展涨 = 流量变贵"},
 {en:"CPC vs CPM",zh:"按点击算 vs 按曝光算"}]},
w029:{more:[
 {en:"conversion rate (CVR)",zh:"转化率"},
 {en:"convert · conversion",zh:"动词 / 名词"},
 {en:"post-entry conversion",zh:"进房后转化"}]},
w030:{ipa:"/ˌeɪ oʊ ˈviː/",say:"A O V",more:[
 {en:"AOV = average order value",zh:"全称"},
 {en:"lift the AOV with a bundle",zh:"用组合装拉客单"}]},
w031:{say:"week over week",more:[
 {en:"WoW · MoM · YoY",zh:"环比周 · 环比月 · 同比年"},
 {en:"down 23% WoW",zh:"环比降 23%"},
 {en:"flat WoW",zh:"环比持平"}]},
w032:{more:[
 {en:"impressions vs reach",zh:"曝光次数 vs 触达人数"},
 {en:"⚠️ 永远用复数 impressions",zh:"不说 impression"}]},
w033:{senses:[{pos:"n.",zh:"份额"},{pos:"v.",zh:"分享、共享"}],more:[
 {en:"market share",zh:"市场份额"},
 {en:"share of voice",zh:"声量份额"},
 {en:"Share your screen.",zh:"共享一下屏幕"}]},
w034:{ipa:"/əˈnɑː.mə.li/",more:[
 {en:"an anomaly · anomalies",zh:"单数 / 复数"},
 {en:"flag the anomaly",zh:"把异动报出来"},
 {en:"no anomaly today",zh:"今天没异常"}]},
w035:{ipa:"/ˈbentʃ.mɑːrk/",senses:[{pos:"n.",zh:"基准线"},{pos:"v.",zh:"对标"}],more:[
 {en:"above / below benchmark",zh:"高于 / 低于基准"},
 {en:"category benchmark",zh:"类目基准"}]},
w036:{say:"market wide",more:[
 {en:"Is it us or the market?",zh:"是我们的问题还是大盘的"},
 {en:"market-wide drop",zh:"大盘性下滑"}]},
w037:{more:[
 {en:"hypothesis · hypotheses",zh:"单数 / 复数（读音也变）"},
 {en:"test a hypothesis",zh:"验证一个假设"}]},
w038:{more:[
 {en:"seeding vs harvesting",zh:"种草 vs 收割"},
 {en:"seeding efficiency",zh:"种草效率"}]},
w039:{say:"conversion end",more:[
 {en:"A→C→V funnel",zh:"认知→意向→成交 漏斗"},
 {en:"harvesting end",zh:"收割端（同义说法）"}]},
w040:{ipa:"/ˈbɑː.t̬əl.nek/",more:[
 {en:"The bottleneck is at X.",zh:"瓶颈在 X"},
 {en:"remove the bottleneck",zh:"打通瓶颈"}]},
/* ---- 直播运营 ---- */
w041:{say:"live room",more:[
 {en:"go live · end the stream",zh:"开播 · 收播"},
 {en:"Room 2 · the main room",zh:"2 号间 · 主力间"},
 {en:"live vs short video",zh:"直播 vs 短视频"}]},
w042:{senses:[{pos:"n.",zh:"主播"},{pos:"v.",zh:"主持、承接"}],more:[
 {en:"assistant host",zh:"助播"},
 {en:"host rotation",zh:"主播轮换"},
 {en:"The host went off script.",zh:"主播脱稿了"}]},
w043:{senses:[{pos:"n.",zh:"话术脚本"},{pos:"v.",zh:"写脚本"}],more:[
 {en:"follow the script · go off script",zh:"照话术走 · 脱稿"},
 {en:"talk track",zh:"话术（同义，更口语）"},
 {en:"script loop",zh:"一轮话术循环"}]},
w044:{more:[
 {en:"opening hook",zh:"开场钩子"},
 {en:"The hook is weak.",zh:"钩子不行"},
 {en:"first three seconds",zh:"前三秒"}]},
w045:{ipa:"/rɪˈten.ʃən/",more:[
 {en:"retention rate",zh:"留存率"},
 {en:"retain viewers",zh:"留住观众"},
 {en:"drop-off",zh:"掉出（留存的反面）"}]},
w046:{say:"room entry rate",more:[
 {en:"room-entry rate = entries ÷ impressions",zh:"进房率算法"},
 {en:"entries",zh:"进房量"}]},
w047:{say:"watch time",more:[
 {en:"avg. watch time",zh:"平均观看时长"},
 {en:"watch time fell to 14 seconds",zh:"时长掉到 14 秒"}]},
w048:{say:"push sale",more:[
 {en:"close the sale",zh:"促单成交（同义）"},
 {en:"push harder on the voucher",zh:"券再推狠一点"},
 {en:"urgency",zh:"紧迫感"}]},
w049:{say:"pain point",more:[
 {en:"pain point vs selling point",zh:"用户的痛 vs 产品的好"},
 {en:"hit the pain point",zh:"打中痛点"}]},
w050:{say:"selling point",more:[
 {en:"USP = unique selling point",zh:"独特卖点"},
 {en:"selling point → benefit",zh:"卖点要翻译成利益点才有人听"}]},
w051:{ipa:"/ˈɡɪv.ə.weɪ/",more:[
 {en:"gift · freebie · giveaway",zh:"三个词都能指赠品"},
 {en:"gift with purchase (GWP)",zh:"买赠"}]},
w052:{more:[
 {en:"voucher (英) = coupon (美)",zh:"两边说法不同"},
 {en:"apply the voucher",zh:"用券"},
 {en:"voucher stack",zh:"券叠加"}]},
w053:{ipa:"/ˌsiː tiː ˈeɪ/",say:"C T A",more:[
 {en:"CTA = call to action",zh:"全称"},
 {en:"strong CTA · weak CTA",zh:"号召力强 · 弱"}]},
w054:{senses:[{pos:"n.",zh:"排班表"},{pos:"n.",zh:"名单"}],more:[
 {en:"roster = schedule",zh:"两个词都行"},
 {en:"host roster for August",zh:"8 月主播排班"}]},
w055:{say:"add the product link",more:[
 {en:"no product link",zh:"不挂车"},
 {en:"linked video vs organic video",zh:"挂车视频 vs 纯内容视频"},
 {en:"⚠️ 别直译「挂车」",zh:"trailer 是拖车，完全不同"}]},
w056:{say:"product card",more:[
 {en:"product card GMV",zh:"商品卡成交"},
 {en:"three channels: live, video, product card",zh:"三个成交渠道"}]},
w057:{say:"short video",more:[
 {en:"short-video share",zh:"短视频占比"},
 {en:"post a video",zh:"发一条视频"}]},
w058:{say:"screen recording",more:[
 {en:"record your screen",zh:"录屏（动词）"},
 {en:"screenshot vs screen recording",zh:"截图 vs 录屏"}]},
w059:{senses:[{pos:"n.",zh:"背景、布景"},{pos:"n.",zh:"来龙去脉"}],more:[
 {en:"Let me give you some background.",zh:"我先说一下背景"},
 {en:"change the background",zh:"换背景"}]},
w060:{say:"post mortem",more:[
 {en:"review (日常) · post-mortem (正式)",zh:"两种说法的场合"},
 {en:"weekly review · monthly review",zh:"周复盘 · 月复盘"}]},
/* ---- 订单履约 ---- */
w061:{senses:[{pos:"n.",zh:"订单"},{pos:"v.",zh:"下单、订购"}],more:[
 {en:"place an order",zh:"下单"},
 {en:"hourly orders",zh:"每小时成交量"},
 {en:"order surge",zh:"爆单"}]},
w062:{ipa:"/fʊlˈfɪl.mənt/",more:[
 {en:"fulfill · fulfillment",zh:"动词 / 名词"},
 {en:"fulfillment rate",zh:"履约率"},
 {en:"self-fulfilled vs platform-fulfilled",zh:"自发货 vs 平台发货"}]},
w063:{senses:[{pos:"v.",zh:"发货"},{pos:"n.",zh:"船（本义）"}],more:[
 {en:"shipped · in transit · delivered",zh:"已发货 → 在途 → 已妥投"},
 {en:"ship out today",zh:"今天发出"}]},
w064:{say:"delivery time",more:[
 {en:"lead time",zh:"时效（同义，更正式）"},
 {en:"3-5 business days",zh:"3-5 个工作日"},
 {en:"⚠️ 别和广告的 delivery 混",zh:"物流场景才是时效"}]},
w065:{say:"tracking number",more:[
 {en:"track the parcel",zh:"查件"},
 {en:"shipping label",zh:"面单"},
 {en:"waybill",zh:"运单（正式）"}]},
w066:{say:"out of stock",more:[
 {en:"in stock · out of stock · low stock",zh:"有货 · 缺货 · 库存告急"},
 {en:"stockout",zh:"断货（名词）"}]},
w067:{ipa:"/ˌriːˈstɑːk/",more:[
 {en:"restock · replenish",zh:"补货两种说法"},
 {en:"stock up before the campaign",zh:"大促前备货"}]},
w068:{ipa:"/ˈɪn.vən.tɔːr.i/",more:[
 {en:"inventory (美) = stock (英)",zh:"同义"},
 {en:"inventory turnover",zh:"库存周转"},
 {en:"dead stock",zh:"滞销库存"}]},
w069:{ipa:"/ˈwer.haʊs/",more:[
 {en:"overseas warehouse · bonded warehouse",zh:"海外仓 · 保税仓"},
 {en:"3PL warehouse",zh:"第三方仓"}]},
w070:{say:"customs clearance",more:[
 {en:"clear customs",zh:"清关（动词）"},
 {en:"stuck at customs",zh:"卡关"},
 {en:"declare · declaration",zh:"报关"}]},
w071:{senses:[{pos:"n.",zh:"退货"},{pos:"v.",zh:"退回、返回"}],more:[
 {en:"return = 货回来 ｜ refund = 钱回去",zh:"最容易混的一对"},
 {en:"return window",zh:"退货期限"},
 {en:"return and exchange",zh:"退换货"}]},
w072:{ipa:"/ˈriː.fʌnd/",senses:[{pos:"n.",zh:"退款（名词，重音在前）"},{pos:"v.",zh:"退款（动词，重音在后 /rɪˈfʌnd/）"}],more:[
 {en:"issue a refund",zh:"给退款"},
 {en:"partial refund",zh:"部分退款"},
 {en:"refund without return",zh:"仅退款不退货"}]},
w073:{say:"after sales",more:[
 {en:"after-sales team",zh:"售后团队"},
 {en:"customer service (CS)",zh:"客服"}]},
w074:{senses:[{pos:"n.",zh:"投诉"},{pos:"n.",zh:"抱怨"}],more:[
 {en:"file a complaint",zh:"提投诉"},
 {en:"complain (v.) · complaint (n.)",zh:"注意拼写差一个 t"}]},
w075:{say:"negative review",more:[
 {en:"positive rating",zh:"好评率"},
 {en:"1-star review",zh:"一星差评"},
 {en:"review vs 复盘的 review",zh:"这里是买家评价"}]},
w076:{say:"last mile",more:[
 {en:"first leg · last mile",zh:"头程 · 尾程"},
 {en:"last-mile delay",zh:"尾程延误"}]},
w077:{say:"free shipping",more:[
 {en:"shipping fee",zh:"运费"},
 {en:"free shipping over 200",zh:"满 200 包邮"}]},
w078:{more:[
 {en:"delivered on time",zh:"按时妥投"},
 {en:"on-time delivery rate (OTD)",zh:"妥投率"}]},
/* ---- 商品定价 ---- */
w079:{ipa:"/ˌes keɪ ˈjuː/",say:"S K U",more:[
 {en:"SKU vs SPU",zh:"单品规格 vs 商品款"},
 {en:"top SKU",zh:"主推单品"},
 {en:"SKU-level data",zh:"单品级数据"}]},
w080:{ipa:"/ˈlɪs.tɪŋ/",more:[
 {en:"list · delist",zh:"上架 · 下架"},
 {en:"The listing is live.",zh:"链接上架了"},
 {en:"listing optimization",zh:"链接优化"}]},
w081:{senses:[{pos:"n.",zh:"上新、发布"},{pos:"v.",zh:"发布、上线"}],more:[
 {en:"new launch · relaunch",zh:"新品上市 · 重新上市"},
 {en:"launch date",zh:"上新日期"}]},
w082:{more:[
 {en:"final price",zh:"到手价"},
 {en:"price war",zh:"价格战"},
 {en:"reprice",zh:"调价"}]},
w083:{senses:[{pos:"n.",zh:"折扣"},{pos:"v.",zh:"打折"}],more:[
 {en:"spend-and-save",zh:"满减"},
 {en:"flash sale",zh:"秒杀"},
 {en:"deep discount",zh:"大折扣"}]},
w084:{senses:[{pos:"n.",zh:"组合装"},{pos:"v.",zh:"打包卖"}],more:[
 {en:"three-piece bundle",zh:"三件套"},
 {en:"bundle vs single",zh:"组合装 vs 单品"},
 {en:"Bundling lifts AOV.",zh:"组合装拉客单"}]},
w085:{more:[
 {en:"commission rate",zh:"佣金率"},
 {en:"platform cut",zh:"平台抽成"},
 {en:"on commission",zh:"按佣金结算"}]},
w086:{say:"gross margin",more:[
 {en:"gross margin vs net margin",zh:"毛利 vs 净利"},
 {en:"margin is thin",zh:"毛利薄"},
 {en:"margin can't take it",zh:"毛利撑不住"}]},
w087:{more:[
 {en:"category ranking",zh:"类目排名"},
 {en:"skincare · makeup · personal care",zh:"护肤 · 彩妆 · 个护"},
 {en:"sub-category",zh:"二级类目"}]},
w088:{ipa:"/ˈræŋ.kɪŋ/",more:[
 {en:"make the ranking",zh:"上榜"},
 {en:"top 10 ahead of us",zh:"我们前面的 top10"},
 {en:"leaderboard",zh:"榜单（同义）"}]},
w089:{ipa:"/kəmˈpet̬.ɪ.t̬ɚ/",more:[
 {en:"competitor · competition · competitive",zh:"名词 / 竞争 / 形容词"},
 {en:"benchmark against competitors",zh:"跟竞品对标"}]},
w090:{say:"main image",more:[
 {en:"main image · gallery images",zh:"主图 · 副图"},
 {en:"product page / detail page",zh:"详情页"}]},
w091:{ipa:"/ˈsæm.pəl/",senses:[{pos:"n.",zh:"样品"},{pos:"v.",zh:"抽样、试用"}],more:[
 {en:"send samples",zh:"寄样"},
 {en:"sample request",zh:"索样"},
 {en:"free sample",zh:"试用装"}]},
w092:{say:"main push",more:[
 {en:"hero product",zh:"主推爆品（同义）"},
 {en:"push this SKU",zh:"主推这个单品"}]},
w093:{ipa:"/ɪnˈɡriː.di.ənt/",more:[
 {en:"key ingredient",zh:"核心成分"},
 {en:"ingredient claim",zh:"成分宣称"},
 {en:"⚠️ 宣称受法规限制",zh:"越南和国内口径不同"}]},
w094:{senses:[{pos:"n.",zh:"色号"},{pos:"n.",zh:"阴影"}],more:[
 {en:"shade range",zh:"色号齐全度"},
 {en:"best-selling shade",zh:"最好卖的色号"}]},
/* ---- 平台运营 ---- */
w095:{senses:[{pos:"n.",zh:"店铺"},{pos:"v.",zh:"购物"}],more:[
 {en:"cross-border shop · local shop",zh:"跨境店 · 本土店"},
 {en:"shop tab",zh:"店铺页"},
 {en:"Shop Tab GMV",zh:"店铺页成交"}]},
w096:{more:[
 {en:"seller center",zh:"商家后台"},
 {en:"seller vs creator",zh:"商家 vs 达人"},
 {en:"top seller",zh:"头部商家"}]},
w097:{ipa:"/kriˈeɪ.t̬ɚ/",more:[
 {en:"creator · influencer · KOL",zh:"三个词都指达人"},
 {en:"top creator · nano creator",zh:"头部达人 · 尾部达人"},
 {en:"creator outreach",zh:"达人邀约"}]},
w098:{more:[
 {en:"affiliate video · affiliate live",zh:"达人视频 · 达人直播"},
 {en:"affiliate commission",zh:"达人佣金"},
 {en:"self-account vs affiliate",zh:"自播 vs 达播"}]},
w099:{say:"organic traffic",more:[
 {en:"organic vs paid",zh:"自然 vs 付费"},
 {en:"organic reach",zh:"自然触达"}]},
w100:{ipa:"/ˌvaɪ.əˈleɪ.ʃən/",more:[
 {en:"violate · violation",zh:"动词 / 名词"},
 {en:"penalty · account ban",zh:"处罚 · 封号"},
 {en:"repeat violation",zh:"重复违规"}]},
w101:{senses:[{pos:"n.",zh:"申诉"},{pos:"v.",zh:"申诉、上诉"}],more:[
 {en:"file an appeal",zh:"提申诉"},
 {en:"appeal was rejected",zh:"申诉被驳回"}]},
w102:{say:"under review",more:[
 {en:"pending review",zh:"待审"},
 {en:"review passed · rejected",zh:"审核通过 · 驳回"}]},
w103:{say:"account approved",more:[
 {en:"the account goes live",zh:"户下来了（同义）"},
 {en:"account setup",zh:"开户"}]},
w104:{ipa:"/ˌbiː ˈsiː/",say:"B C",more:[
 {en:"BC = Business Center",zh:"全称"},
 {en:"which BC, which account",zh:"哪个 BC 哪个户"}]},
w105:{more:[
 {en:"back end",zh:"后台（同义）"},
 {en:"log into the dashboard",zh:"登后台"}]},
w106:{say:"pull the data",more:[
 {en:"pull · export · download",zh:"取数三种说法"},
 {en:"pull it by day",zh:"按天拉"}]},
w107:{senses:[{pos:"v.",zh:"导出"},{pos:"n.",zh:"导出的文件"}],more:[
 {en:"export to Excel",zh:"导成 Excel"},
 {en:"the export is missing a column",zh:"导出少了一列"}]},
w108:{senses:[{pos:"v.",zh:"登记、记录"},{pos:"n.",zh:"日志"}],more:[
 {en:"log it in the sheet",zh:"登记到表里"},
 {en:"log in (登录) vs log (登记)",zh:"⚠️ 别混"}]},
w109:{say:"sign up",more:[
 {en:"sign up vs sign in",zh:"报名/注册 vs 登录"},
 {en:"sign-up deadline",zh:"报名截止"}]},
w110:{say:"go live",more:[
 {en:"go live = 上线 / 开播",zh:"两个意思都有"},
 {en:"live date",zh:"上线日期"}]},
w111:{ipa:"/ˈʃɑː.piː/",say:"Shopee",more:[
 {en:"Shopee · Lazada · TikTok Shop",zh:"东南亚三大平台"},
 {en:"Shopee local",zh:"虾皮本土"}]},
w112:{say:"traffic structure",more:[
 {en:"traffic mix",zh:"流量结构（同义）"},
 {en:"traffic source breakdown",zh:"流量来源拆解"}]},
/* ---- 财务结算 ---- */
w113:{more:[
 {en:"settle · settlement",zh:"动词 / 名词"},
 {en:"settlement cycle",zh:"结算周期"}]},
w114:{say:"payment terms",more:[
 {en:"net 30",zh:"30 天账期（行业写法）"},
 {en:"extend the payment terms",zh:"延长账期"}]},
w115:{ipa:"/ˈɪn.vɔɪs/",more:[
 {en:"issue an invoice",zh:"开发票"},
 {en:"invoice vs receipt",zh:"发票 vs 收据"}]},
w116:{senses:[{pos:"n.",zh:"报价"},{pos:"v.",zh:"报价、引用"}],more:[
 {en:"request a quote (RFQ)",zh:"询价"},
 {en:"quote is too high",zh:"报价太高"}]},
w117:{ipa:"/ˈrek.ən.saɪl/",more:[
 {en:"reconcile · reconciliation",zh:"动词 / 名词"},
 {en:"the numbers don't reconcile",zh:"两边数对不上"}]},
w118:{ipa:"/ˌpriːˈpeɪ/",more:[
 {en:"prepay · prepayment · deposit",zh:"预付 · 预付款 · 定金"},
 {en:"pay on delivery",zh:"货到付款"}]},
w119:{ipa:"/ˈriː.bæt/",more:[
 {en:"volume rebate",zh:"量返"},
 {en:"hit the target for the rebate",zh:"达标拿返点"}]},
w120:{say:"exchange rate",more:[
 {en:"FX rate",zh:"汇率（金融写法）"},
 {en:"lock the rate",zh:"锁汇率"}]},
w121:{ipa:"/ˌriː.ɪmˈbɝːs.mənt/",more:[
 {en:"reimburse · reimbursement",zh:"动词 / 名词"},
 {en:"submit for reimbursement",zh:"提报销"}]},
w122:{ipa:"/ˌpiː ˈoʊ/",say:"P O",more:[
 {en:"PO = purchase order",zh:"全称"},
 {en:"raise a PO",zh:"开采购单"}]},
w123:{senses:[{pos:"n.",zh:"成本"},{pos:"n.",zh:"消耗（广告场景）"},{pos:"v.",zh:"花费、值多少钱"}],more:[
 {en:"cost of goods (COGS)",zh:"货物成本"},
 {en:"How much does it cost?",zh:"多少钱"}]},
w124:{say:"payment received",more:[
 {en:"outstanding payment",zh:"未回款"},
 {en:"chase the payment",zh:"催款"}]},
/* ---- 协作流程 ---- */
w125:{more:[
 {en:"align on something",zh:"就某事对齐（介词固定用 on）"},
 {en:"we're aligned",zh:"我们对齐了"},
 {en:"misalignment",zh:"没对齐 / 有分歧"}]},
w126:{say:"follow up",more:[
 {en:"follow up (v.) · follow-up (n.)",zh:"动词分开写，名词加连字符"},
 {en:"follow up with him",zh:"去跟他跟进"},
 {en:"I'll follow up tomorrow.",zh:"我明天跟"}]},
w127:{more:[
 {en:"chase vs follow up",zh:"chase 更急、更催"},
 {en:"chase the contract",zh:"催合同"},
 {en:"stop chasing me",zh:"别催我了（对方可能这么说）"}]},
w128:{more:[
 {en:"What's the status?",zh:"什么进度"},
 {en:"status update",zh:"进度更新"},
 {en:"⚠️ 别说 What's the progress",zh:"语法没错但不自然"}]},
w129:{ipa:"/blɑːkt/",more:[
 {en:"blocked on X",zh:"卡在 X（介词用 on）"},
 {en:"blocker",zh:"卡点（名词）"},
 {en:"unblock it",zh:"打通"}]},
w130:{more:[
 {en:"approve · approval · approved",zh:"动词 / 名词 / 形容词"},
 {en:"pending approval",zh:"待审批"},
 {en:"get sign-off",zh:"拿到批准（同义）"}]},
w131:{say:"out of scope",more:[
 {en:"in scope vs out of scope",zh:"职责内 vs 越权"},
 {en:"scope creep",zh:"范围失控（对方加需求）"}]},
w132:{ipa:"/ˈmen.tɔːr/",more:[
 {en:"mentor vs manager",zh:"带教人 vs 直属上级"},
 {en:"check with my mentor",zh:"跟带教人确认"}]},
w133:{say:"hand over",more:[
 {en:"hand over (v.) · handover (n.)",zh:"动词分开，名词连写"},
 {en:"hand it to BD",zh:"转给 BD"}]},
w134:{senses:[{pos:"v.",zh:"反馈、提出来"},{pos:"n.",zh:"标记、旗子"}],more:[
 {en:"flag it in time",zh:"及时反馈"},
 {en:"raise it",zh:"提出来（同义）"},
 {en:"flag vs complain",zh:"flag 中性，complain 是抱怨"}]},
w135:{ipa:"/sɪŋk/",senses:[{pos:"v.",zh:"同步信息"},{pos:"n.",zh:"一个短会"}],more:[
 {en:"a quick sync",zh:"快速对一下"},
 {en:"⚠️ 你说的「同步下」多半是 send / send over",zh:"发东西给我 ≠ sync"}]},
w136:{ipa:"/pɔɪnt əv ˈkɑːn.tækt/",say:"point of contact",more:[
 {en:"POC",zh:"缩写"},
 {en:"Who's the POC on their side?",zh:"他们那边谁对接"}]},
w137:{ipa:"/ˈeɪ.dʒən.si/",more:[
 {en:"agency · agencies",zh:"复数变 y→ies"},
 {en:"agency fee",zh:"代理费"},
 {en:"in-house vs agency",zh:"自己做 vs 外包"}]},
w138:{more:[
 {en:"deck = slides",zh:"两个词都行"},
 {en:"⚠️ 说 PPT 老外多数听不懂",zh:"那是软件名，不是文件名"},
 {en:"build the deck",zh:"做 PPT"}]},
w139:{say:"daily report",more:[
 {en:"daily · weekly · monthly report",zh:"日报 · 周报 · 月报"},
 {en:"EOD report",zh:"下班前报（内部用，对外别缩写）"}]},
w140:{senses:[{pos:"v.",zh:"推进"},{pos:"n.",zh:"云盘（Google Drive）"}],more:[
 {en:"drive it forward",zh:"往前推"},
 {en:"drive vs push",zh:"drive 是主导，push 是施压"}]},
w141:{ipa:"/ˈes.kə.leɪt/",more:[
 {en:"escalate to my manager",zh:"上升到我的上级"},
 {en:"escalation",zh:"名词"},
 {en:"⚠️ 很重，用之前先给对方一次机会",zh:"直接 escalate 会得罪人"}]},
w142:{say:"convert to full time",more:[
 {en:"intern → full-time",zh:"实习转正"},
 {en:"probation period",zh:"试用期"}]},
w143:{say:"check with",more:[
 {en:"check with (人) vs check on (事)",zh:"跟人确认 vs 看看某事"},
 {en:"⚠️ 别用 run it by",zh:"二语者容易听不懂"}]},
w144:{say:"walk me through",more:[
 {en:"walk me through the process",zh:"给我讲一遍流程"},
 {en:"talk me through it",zh:"同义"}]},
w145:{say:"keep me posted",more:[
 {en:"keep me in the loop",zh:"让我知道进展（同义）"},
 {en:"结束对话最好用的一句",zh:"比 thanks 有信息量"}]},
w146:{say:"take the lead",more:[
 {en:"own it",zh:"负责到底（同义，更短）"},
 {en:"Who owns this?",zh:"这个谁负责"}]},
/* ---- 主体合规 ---- */
w147:{say:"legal entity",more:[
 {en:"entity name",zh:"主体名称"},
 {en:"⚠️ 别说 subject / body",zh:"那是错的，对方会听不懂"},
 {en:"registered in Vietnam",zh:"在越南注册的"}]},
w148:{more:[
 {en:"sign a contract",zh:"签合同"},
 {en:"addendum",zh:"补充协议"},
 {en:"contract terms",zh:"合同条款"}]},
w149:{say:"sign and stamp",more:[
 {en:"⚠️ 英美只签字，中越要盖章",zh:"所以要说全，不能只说 sign"},
 {en:"company seal / chop",zh:"公章"}]},
w150:{ipa:"/ˌɑː.θɚ.əˈzeɪ.ʃən/",more:[
 {en:"authorize · authorization",zh:"动词 / 名词"},
 {en:"authorization letter",zh:"授权书"},
 {en:"authorized reseller",zh:"授权经销商"}]},
w151:{say:"cross border",more:[
 {en:"cross-border vs local",zh:"跨境 vs 本土"},
 {en:"⚠️ 定价、时效、退款率都不同",zh:"合并算数据一定错"}]},
w152:{senses:[{pos:"adj.",zh:"本土的"},{pos:"n.",zh:"本地人"}],more:[
 {en:"local shop · local team",zh:"本土店 · 本地团队"},
 {en:"localize",zh:"本地化"}]},
w153:{ipa:"/kəmˈplaɪ.əns/",more:[
 {en:"comply · compliance · compliant",zh:"动词 / 名词 / 形容词"},
 {en:"compliance check",zh:"合规审查"}]},
w154:{say:"legal team",more:[
 {en:"legal has objections",zh:"法务有异议"},
 {en:"our legal vs their legal",zh:"双方法务"}]},
w155:{senses:[{pos:"n.",zh:"许可证、执照"},{pos:"v.",zh:"授权许可"}],more:[
 {en:"business license",zh:"营业执照"},
 {en:"licensed to sell",zh:"有销售资质"}]},
w156:{say:"verification code",more:[
 {en:"OTP",zh:"一次性验证码（缩写）"},
 {en:"The code expired.",zh:"验证码过期了"}]},
w157:{senses:[{pos:"n.",zh:"权限、访问"},{pos:"v.",zh:"访问"}],more:[
 {en:"I don't have access.",zh:"我没权限"},
 {en:"grant / revoke access",zh:"给权限 / 收回权限"}]},
w158:{say:"reporting line",more:[
 {en:"report to (人)",zh:"向某人汇报"},
 {en:"dotted line",zh:"虚线汇报"}]},
};
