import { useEffect, useState } from "react";
import axios from "axios";

export default function CallQuery(query, page) {
  const baseUrl = "http://localhost:5000/";

  const [items, setData] = useState("");
  const [filteredItems, setFilteredItems] = useState([items]);

  useEffect(() => {
    let cancel;
    axios
      .get(baseUrl + "restaurants/english", {
        params: {
          store_name: query.storeName,
          sort_value: query.sortValue,
          prefecture_value: query.prefectureValue,
          rating_min: query.ratingRange[0] / 10,
          rating_max: query.ratingRange[1] / 10,
          review_min: query.reviewRange[0],
          review_max: query.reviewRange[1],
          latitude: query.latitude,
          longitude: query.longitude,
          lunch_min: query.lunchRange[0],
          lunch_max: query.lunchRange[1],
          dinner_min: query.dinnerRange[0],
          dinner_max: query.dinnerRange[1],
          page: 1,
          limit: 12,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((responses) => {
        setFilteredItems(
          responses.data.map((response) => {
            const container = {};

            container["store_name"] = response.store_name;
            container["store_name_english"] = response.store_name_english;
            container["score"] = response.score;
            container["review_cnt"] = response.review_cnt;
            container["tabelog_lunch_budget_min"] =
              response.tabelog_lunch_budget_min;
            container["tabelog_lunch_budget_max"] =
              response.tabelog_lunch_budget_max;
            container["tabelog_dinner_budget_min"] =
              response.tabelog_dinner_budget_min;
            container["tabelog_dinner_budget_max"] =
              response.tabelog_dinner_budget_max;
            // container["customer_lunch_budget_min"] =
            //   response.customer_lunch_budget_min;
            // container["customer_lunch_budget_max"] =
            //   response.customer_lunch_budget_max;
            // container["customer_dinner_budget_min"] =
            //   response.customer_dinner_budget_min;
            // container["customer_dinner_budget_max"] =
            //   response.customer_dinner_budget_max;
            container["distance"] = response.distance;
            container["url"] = response.url;
            container["url_english"] = response.url_english;
            container["address"] = response.address;
            container["prefecture"] = response.prefecture;
            container["address_english"] = response.address_english;
            container["prefecture_english"] = response.prefecture_english;
            container["website"] = response.website;

            return container;
          })
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
    return (filteredItems) => cancel();
  }, [query, page]);
  return null;
}
