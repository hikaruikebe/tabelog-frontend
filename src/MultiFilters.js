import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./style.css";
import Slider from "react-slider";
// import { default as ReactSelect } from "react-select";
// import { components } from "react-select";

const RATING_MIN = 30;
const RATING_MAX = 50;
const REVIEW_MIN = 0;
const REVIEW_MAX = 5000;
export const prefectureOptions = [
  { label: "北海道 (Hokkaido)", value: "北海道" },
  { label: "青森県 (Aomori)", value: "青森県" },
  { label: "岩手県 (Iwate)", value: "岩手県" },
  { label: "宮城県 (Miyagi)", value: "宮城県" },
  { label: "秋田県 (Akita)", value: "秋田県" },
  { label: "山形県 (Yamagata)", value: "山形県" },
  { label: "福島県 (Fukushima)", value: "福島県" },
  { label: "茨城県 (Ibaraki)", value: "茨城県" },
  { label: "栃木県 (Tochigi)", value: "栃木県" },
  { label: "群馬県 (Gunma)", value: "群馬県" },
  { label: "埼玉県 (Saitama)", value: "埼玉県" },
  { label: "千葉県 (Ciba)", value: "千葉県" },
  { label: "東京都 (Tokyo)", value: "東京都" },
  { label: "神奈川県 (Kanagawa)", value: "神奈川県" },
  { label: "新潟県 (Niigata)", value: "新潟県" },
  { label: "富山県 (Toyama)", value: "富山県" },
  { label: "石川県 (Ishikawa)", value: "石川県" },
  { label: "福井県 (Fukui)", value: "福井県" },
  { label: "山梨県 (Yamanashi)", value: "山梨県" },
  { label: "長野県 (Nagano)", value: "長野県" },
  { label: "岐阜県 (Gifu)", value: "岐阜県" },
  { label: "静岡県 (Shizuoka)", value: "静岡県" },
  { label: "愛知県 (Aichi)", value: "愛知県" },
  { label: "三重県 (Mie)", value: "三重県" },
  { label: "滋賀県 (Shiga)", value: "滋賀県" },
  { label: "京都府 (Kyoto)", value: "京都府" },
  { label: "大阪府 (Osaka)", value: "大阪府" },
  { label: "兵庫県 (Hyogo)", value: "兵庫県" },
  { label: "奈良県 (Nara)", value: "奈良県" },
  { label: "和歌山県 (Wakayama)", value: "和歌山県" },
  { label: "鳥取県 (Tottori)", value: "鳥取県" },
  { label: "島根県 (Shimane)", value: "島根県" },
  { label: "岡山県 (Okayama)", value: "岡山県" },
  { label: "広島県 (Hiroshima)", value: "広島県" },
  { label: "山口県 (Yamaguchi)", value: "山口県" },
  { label: "徳島県 (Tokushima)", value: "徳島県" },
  { label: "香川県 (Kagawa)", value: "香川県" },
  { label: "愛媛県 (Ehime)", value: "愛媛県" },
  { label: "高知県 (Koci)", value: "高知県" },
  { label: "福岡県 (Fukuoka)", value: "福岡県" },
  { label: "佐賀県 (Saga)", value: "佐賀県" },
  { label: "長崎県 (Nagasaki)", value: "長崎県" },
  { label: "熊本県 (Kumamoto)", value: "熊本県" },
  { label: "大分県 (Oita)", value: "大分県" },
  { label: "宮崎県 (Miyazaki)", value: "宮崎県" },
  { label: "鹿児島県 (Kagoshima)", value: "鹿児島県" },
  { label: "沖縄県 (Okinawa)", value: "沖縄県" },
];

export const sortOptions = [
  { label: "Random", value: ["score", "random"] },
  { label: "Ratings Ascending", value: ["score", "ASC"] },
  { label: "Ratings Descending", value: ["score", "DESC"] },
];

// export const sortOptions = ["Ratings Ascending", "Ratings Descending"];

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
  const [prefectureValue, setPrefectureValue] = useState();
  const [items, setData] = useState("");

  // const baseUrl = "https://tabelog.onrender.com/";
  const baseUrl = "https://tabelog-backend.onrender.com/";
  // const baseUrl = "http://localhost:5000/";

  // const getItems = () => {
  //   axios
  //     .get(`${baseUrl}restaurants/english`)
  //     .then((responses) => {
  //       setData(
  //         responses.data.map((response) => {
  //           const container = {};

  //           container["store_name"] = response.store_name;
  //           container["store_name_english"] = response.store_name_english;
  //           container["score"] = response.score;
  //           container["review_cnt"] = response.review_cnt;
  //           container["url"] = response.url;
  //           container["url_english"] = response.url_english;
  //           container["address"] = response.address;
  //           container["address_english"] = response.address_english;
  //           container["website"] = response.website;
  //           return container;
  //         })
  //       );
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

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
    [storeName, sortValue, prefectureValue, ratingRange, reviewRange]
  );

  // const handleChange = (selectedOption) => {
  //   console.log("handleChange: ", selectedOption);
  // };

  const filterItems = () => {
    console.log(
      `store_name: ${storeName}
      sort_value: ${sortValue}
      prefecture_value: ${prefectureValue}
      ratingrange: ${ratingRange}
      reviewrange: ${reviewRange}`
    );

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
    });

    axios
      .get(baseUrl + "restaurants/english", {
        params: {
          store_name: storeName,
          sort_value: sortValue,
          prefecture_value: prefectureValue,
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

      <table>
        <tbody>
          <tr>
            <td size="8" className="sortFilter">
              <h2>Sort by</h2>
              <Select
                options={sortOptions}
                onChange={(e) => setSortValue(e.value)}
              />
            </td>

            <td size="8" className="prefectureFilter">
              <h2>Select Prefecture</h2>
              <Select
                options={prefectureOptions}
                onChange={setPrefectureValue}
                isMulti
              />
            </td>
          </tr>
        </tbody>
      </table>

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
