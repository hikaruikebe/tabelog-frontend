import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import Slider from "react-slider";
// import { default as ReactSelect } from "react-select";
// import { components } from "react-select";

const RATING_MIN = 30;
const RATING_MAX = 50;
const REVIEW_MIN = 0;
const REVIEW_MAX = 5000;
export const prefectureOptions = {
  "北海道 (Hokkaido)": "北海道",
  "青森県 (Aomori)": "青森県",
  "岩手県 (Iwate)": "岩手県",
  "宮城県 (Miyagi)": "宮城県",
  "秋田県 (Akita)": "秋田県",
  "山形県 (Yamagata)": "山形県",
  "福島県 (Fukushima)": "福島県",
  "茨城県 (Ibaraki)": "茨城県",
  "栃木県 (Tochigi)": "栃木県",
  "群馬県 (Gunma)": "群馬県",
  "埼玉県 (Saitama)": "埼玉県",
  "千葉県 (Ciba)": "千葉県",
  "東京都 (Tokyo)": "東京都",
  "神奈川県 (Kanagawa)": "神奈川県",
  "新潟県 (Niigata)": "新潟県",
  "富山県 (Toyama)": "富山県",
  "石川県 (Ishikawa)": "石川県",
  "福井県 (Fukui)": "福井県",
  "山梨県 (Yamanashi)": "山梨県",
  "長野県 (Nagano)": "長野県",
  "岐阜県 (Gifu)": "岐阜県",
  "静岡県 (Shizuoka)": "静岡県",
  "愛知県 (Aichi)": "愛知県",
  "三重県 (Mie)": "三重県",
  "滋賀県 (Shiga)": "滋賀県",
  "京都府 (Kyoto)": "京都府",
  "大阪府 (Osaka)": "大阪府",
  "兵庫県 (Hyogo)": "兵庫県",
  "奈良県 (Nara)": "奈良県",
  "和歌山県 (Wakayama)": "和歌山県",
  "鳥取県 (Tottori)": "鳥取県",
  "島根県 (Shimane)": "島根県",
  "岡山県 (Okayama)": "岡山県",
  "広島県 (Hiroshima)": "広島県",
  "山口県 (Yamaguchi)": "山口県",
  "徳島県 (Tokushima)": "徳島県",
  "香川県 (Kagawa)": "香川県",
  "愛媛県 (Ehime)": "愛媛県",
  "高知県 (Koci)": "高知県",
  "福岡県 (Fukuoka)": "福岡県",
  "佐賀県 (Saga)": "佐賀県",
  "長崎県 (Nagasaki)": "長崎県",
  "熊本県 (Kumamoto)": "熊本県",
  "大分県 (Oita)": "大分県",
  "宮崎県 (Miyazaki)": "宮崎県",
  "鹿児島県 (Kagoshima)": "鹿児島県",
  "沖縄県 (Okinawa)": "沖縄県",
};

// const DropdownMenu = (props) => {
//   return (
//     <div>
//       <components.Option {...props}>
//         <input
//           type="checkbox"
//           checked={props.isSelected}
//           onChange={() => null}
//         />{" "}
//         <label>{props.label}</label>
//       </components.Option>
//     </div>
//   );
// };

export default function MultiFilters() {
  const [ratingRange, setRatingRange] = useState([RATING_MIN, RATING_MAX]);
  const [reviewRange, setReviewRange] = useState([REVIEW_MIN, REVIEW_MAX]);
  const [storeName, setStoreName] = useState("");
  const [sortValue, setSortValue] = useState();
  // const [prefectureValue, setPrefectureValue] = useState();
  const [items, setData] = useState("");

  // const baseUrl = "https://tabelog.onrender.com/";
  const baseUrl = "https://tabelog-backend.onrender.com/";
  // const baseUrl = "http://localhost:5000/";
  const sortOptions = ["Ratings Ascending", "Ratings Descending"];

  const getItems = () => {
    axios
      .get(`${baseUrl}restaurants/english`)
      .then((responses) => {
        setData(
          responses.data.map((response) => {
            const container = {};

            container["store_name"] = response.store_name;
            container["store_name_english"] = response.store_name_english;
            container["score"] = response.score;
            container["review_cnt"] = response.review_cnt;
            container["url"] = response.url;
            container["url_english"] = response.url_english;
            container["address"] = response.address;
            container["address_english"] = response.address_english;
            container["website"] = response.website;
            return container;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   const dataTimer = setInterval(() => {
  //     getItems();
  //   }, 10000);
  //   return () => clearInterval(dataTimer);
  // }, []);

  const [filteredItems, setFilteredItems] = useState([items]);

  useEffect(
    () => {
      console.log("filter items");
      filterItems();
    },
    // []
    [storeName, sortValue, ratingRange, reviewRange]
  );

  const filterItems = () => {
    console.log(
      "store_name: ",
      storeName,
      "sort_value: ",
      sortValue,
      "ratingrange: ",
      ratingRange,
      "reviewrange: ",
      reviewRange
    );

    axios
      .get(baseUrl + "restaurants/english", {
        params: {
          store_name: storeName,
          sort_value: sortValue,
          rating_min: ratingRange[0] / 10,
          rating_max: ratingRange[1] / 10,
          review_min: reviewRange[0],
          review_max: reviewRange[1],
        },
      })
      .then((responses) => {
        setFilteredItems(
          responses.data.map((response) => {
            const container = {};

            container["store_name"] = response.store_name;
            container["store_name_english"] = response.store_name_english;
            container["score"] = response.score;
            container["review_cnt"] = response.review_cnt;
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
      });
  };

  return (
    <div>
      <div className="wrapper">
        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => setStoreName(e.target.value)}
        ></input>
      </div>

      <div className="wrapper">
        <div className="box">
          <h3>
            Ratings <span>Range</span>
          </h3>
          <div>
            <span className={"value"}>
              Min Rating: {ratingRange[0] / 10} - Max Rating:{" "}
              {ratingRange[1] / 10}
            </span>
          </div>

          <Slider
            className={"slider"}
            onChange={setRatingRange}
            value={ratingRange}
            min={RATING_MIN}
            max={RATING_MAX}
          />

          <br></br>
          <br></br>
          <h3>
            Reviews <span>Range</span>
          </h3>
          <div>
            <span className={"value"}>
              Min Review: {reviewRange[0]} - Max Review: {reviewRange[1]}
            </span>
          </div>

          <Slider
            className={"slider"}
            onChange={setReviewRange}
            value={reviewRange}
            min={REVIEW_MIN}
            max={REVIEW_MAX}
          />
        </div>
      </div>

      <tr>
        <td size="8">
          <h2>Sort by</h2>
          <select
            className={"sort"}
            onChange={(e) => setSortValue(e.target.value)}
            value={sortValue}
          >
            <option>Select Sort</option>
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </td>

        <td size="8">
          <h2>Select Prefecture</h2>
        </td>
      </tr>

      <div className="items-container">
        {filteredItems.map((item, idx) => (
          <div key={`items-${idx}`} className="item">
            <a target="_blank" rel="noopener noreferrer" href={item.url}>
              {item.store_name} ({item.store_name_english})
            </a>

            <p className="prefecture">
              Prefecture: {item.prefecture} ({item.prefecture_english})
            </p>
            <p className="score">Rating: {item.score}</p>
            <p className="review_cnt">Reviews: {item.review_cnt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
