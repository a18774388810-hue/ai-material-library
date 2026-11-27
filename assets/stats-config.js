/* 访问统计配置
 * SUPABASE_URL / SUPABASE_KEY 是公开信息（publishable key 设计上就放在前端），
 * 安全靠数据库的行级策略保证：anon 只能 INSERT，不能读明细，读汇总走 stats_overview()。
 */
window.STATS_CONFIG = {
  SUPABASE_URL : "https://pkyqkambxnsgauyfrgzg.supabase.co",
  SUPABASE_KEY : "sb_publishable_f65RtgkCo5Aq-K23oZhvsQ_1T6_eGY3"
};
