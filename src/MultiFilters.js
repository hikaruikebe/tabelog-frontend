import React, { useEffect, useState, useRef, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import "./style.css";
import Slider from "react-slider";
// import { default as ReactSelect } from "react-select";
// import { components } from "react-select";

const RATING_MIN = 30;
const RATING_MAX = 50;
const REVIEW_MIN = 0;
const REVIEW_MAX = 6000;
const BUDGET_MIN = 0;
const BUDGET_MAX = 100;
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
  {
    label: "Lunch Budget Ascending",
    value: ["tabelog_lunch_budget_min", "ASC NULLS LAST"],
  },
  {
    label: "Lunch Budget Descending",
    value: ["tabelog_lunch_budget_max", "DESC NULLS LAST"],
  },
  {
    label: "Dinner Budget Ascending",
    value: ["tabelog_dinner_budget_min", "ASC NULLS LAST"],
  },
  {
    label: "Dinner Budget Descending",
    value: ["tabelog_dinner_budget_max", "DESC NULLS LAST"],
  },
  { label: "Closest Distance", value: ["distance", "ASC NULLS LAST"] },
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
  const [lunchRange, setLunchRange] = useState([BUDGET_MIN, BUDGET_MAX]);
  const [dinnerRange, setDinnerRange] = useState([BUDGET_MIN, BUDGET_MAX]);
  const [storeName, setStoreName] = useState("");
  const [sortValue, setSortValue] = useState();
  const [prefectureValue, setPrefectureValue] = useState();
  const [items, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        console.log("HasMore: ", hasMore);
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // const baseUrl = "http://localhost:5000/";
  // const baseUrl = "https://tabelog.onrender.com/";
  const baseUrl = "https://tabelog-backend.onrender.com/";

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

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems([]);
    setPage(1);
  }, [
    storeName,
    sortValue,
    prefectureValue,
    ratingRange,
    reviewRange,
    lunchRange,
    dinnerRange,
  ]);

  useEffect(() => {
    filterItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storeName,
    sortValue,
    prefectureValue,
    ratingRange,
    reviewRange,
    lunchRange,
    dinnerRange,
    page,
  ]);

  // useEffect(() => {
  //   axios.get(baseUrl + "restaurants/english", {});
  // }, [page]);

  const filterItems = async () => {
    // console.log(
    //   `store_name: ${storeName}
    //   sort_value: ${sortValue}
    //   prefecture_value: ${prefectureValue}
    //   ratingrange: ${ratingRange}
    //   reviewrange: ${reviewRange}`
    // );

    let latitude = 0;
    let longitude = 0;
    const getCoordinates = async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        };
      } catch (error) {
        console.log(error);
      }
    };

    // const coordinates = await getCoordinates();
    // latitude = coordinates.latitude;
    // longitude = coordinates.longitude;

    // temporary coordinates
    latitude = 35.606797;
    longitude = 139.673123;
    // console.log(lunchRange, dinnerRange);

    setLoading(true);
    setError(false);
    let cancel;
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
          latitude: latitude,
          longitude: longitude,
          lunch_min: lunchRange[0],
          lunch_max: lunchRange[1],
          dinner_min: dinnerRange[0],
          dinner_max: dinnerRange[1],
          page: page,
          limit: 12,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((responses) => {
        setFilteredItems((prevItems) => {
          return [
            ...new Set([
              ...prevItems,
              ...responses.data.map((response) => response),
            ]),
          ];
        });
        console.log(page, responses.data.length, responses.data.length > 0);
        setHasMore(responses.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    return () => cancel();
  };

  function handleSearch(e) {
    setStoreName(e.target.value);
    setPage(1);
  }
  console.log(filteredItems);

  return (
    <div>
      <div className="wrapper">
        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => handleSearch(e)}
        ></input>
      </div>

      <table>
        <tbody>
          <tr>
            <td size="8">
              <div className="wrapper">
                <div className="box">
                  <h3>
                    Ratings <span>Range</span>
                  </h3>
                  <div>
                    <span className={"value"}>
                      Min Rating:{" "}
                      {`${new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(ratingRange[0] / 10)}`}{" "}
                      - Max Rating:{" "}
                      {`${new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(ratingRange[1] / 10)}`}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setRatingRange}
                    value={ratingRange}
                    min={RATING_MIN}
                    max={RATING_MAX}
                  />
                </div>
              </div>
            </td>

            <td size="8">
              <div className="wrapper">
                <div className="box">
                  <h3>
                    Reviews <span>Range</span>
                  </h3>
                  <div>
                    <span className={"value"}>
                      Min Review:{" "}
                      {`${new Intl.NumberFormat("en-IN", {}).format(
                        reviewRange[0]
                      )}`}{" "}
                      - Max Review:{" "}
                      {`${new Intl.NumberFormat("en-IN", {}).format(
                        reviewRange[1]
                      )}`}
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
            </td>

            <td>
              <div className="wrapper">
                <div className="box">
                  <h3>
                    Lunch Budget <span>Range</span>
                  </h3>
                  <div>
                    <span className={"value"}>
                      Min Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(lunchRange[0] * 1000)}{" "}
                      - Max Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(lunchRange[1] * 1000)}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setLunchRange}
                    value={lunchRange}
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                  />
                </div>
              </div>
            </td>

            <td>
              <div className="wrapper">
                <div className="box">
                  <h3>
                    Dinner Budget <span>Range</span>
                  </h3>
                  <div>
                    <span className={"value"}>
                      Min Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(dinnerRange[0] * 1000)}{" "}
                      - Max Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(dinnerRange[1] * 1000)}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setDinnerRange}
                    value={dinnerRange}
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

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
        {filteredItems.map((item, idx) => {
          if (item.length === idx + 1) {
            return (
              <div ref={lastItemRef} key={`items-${idx}`} className="item">
                <a target="_blank" rel="noopener noreferrer" href={item.url}>
                  {item.store_name} ({item.store_name_english})
                </a>

                <p className="prefecture">
                  Prefecture: {item.prefecture} ({item.prefecture_english})
                </p>
                <p className="score">Rating: {item.score}</p>
                <p className="review_cnt">
                  Reviews:{" "}
                  {new Intl.NumberFormat("en-IN").format(item.review_cnt)}
                </p>
                <p className="budget">
                  Tabelog Lunch Price:{" "}
                  {`${new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  }).format(
                    item.tabelog_lunch_budget_min
                  )} ~ ${new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  }).format(item.tabelog_lunch_budget_max)}`}
                </p>
                <p className="budget">
                  Tabelog Dinner Price:{" "}
                  {`${new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  }).format(
                    item.tabelog_dinner_budget_min
                  )} ~ ${new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  }).format(item.tabelog_dinner_budget_max)}`}
                </p>
                <p className="budget">
                  Distance:{" "}
                  {`${new Intl.NumberFormat("en-US", {
                    style: "unit",
                    unit: "kilometer",
                    unitDisplay: "short",
                    maximumFractionDigits: 2,
                  }).format(item.distance)}`}
                </p>
              </div>
            );
          }
          return (
            <div ref={lastItemRef} key={`items-${idx}`} className="item">
              <a target="_blank" rel="noopener noreferrer" href={item.url}>
                {item.store_name} ({item.store_name_english})
              </a>

              <p className="prefecture">
                Prefecture: {item.prefecture} ({item.prefecture_english})
              </p>
              <p className="score">Rating: {item.score}</p>
              <p className="review_cnt">
                Reviews:{" "}
                {new Intl.NumberFormat("en-IN").format(item.review_cnt)}
              </p>
              <p className="budget">
                Tabelog Lunch Price:{" "}
                {`${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }).format(
                  item.tabelog_lunch_budget_min
                )} ~ ${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }).format(item.tabelog_lunch_budget_max)}`}
              </p>
              <p className="budget">
                Tabelog Dinner Price:{" "}
                {`${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }).format(
                  item.tabelog_dinner_budget_min
                )} ~ ${new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }).format(item.tabelog_dinner_budget_max)}`}
              </p>
              <p className="budget">
                Distance:{" "}
                {`${new Intl.NumberFormat("en-US", {
                  style: "unit",
                  unit: "kilometer",
                  unitDisplay: "short",
                  maximumFractionDigits: 2,
                }).format(item.distance)}`}
              </p>
            </div>
          );
        })}
        <div>{loading && "Loading..."}</div>
        <div>{error && "ERROR"}</div>
      </div>
    </div>
  );
}
