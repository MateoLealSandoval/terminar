export interface CalificationSummary {
  avg_score_recommends: number;
  avg_score_service_specialist: number;
  avg_score_recommendations_specialist: number;
  avg_score_personal_attention: number;
  avg_score_quality: number;
  avg_score_time_service: number;
  avg_score_time_waiting: number;
  avg_score_site: number;
  avg_score_ubication_and_comfort: number;
  comments:commentsCalification;
  total: number
}

export interface commentsCalification {
  count: number;
  data: CalificationItem[];
}
export interface CalificationItem {
  coment:string;
  score: number;
}