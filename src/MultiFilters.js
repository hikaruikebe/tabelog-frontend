import React, { useEffect, useState, useRef, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import "./style.css";
import Slider from "react-slider";
import {
  genreReference,
  genreOptions,
  prefectureOptions,
  sortOptions,
} from "./constants";

const RATING_MIN = 30;
const RATING_MAX = 50;
const REVIEW_MIN = 0;
const REVIEW_MAX = 6000;
const BUDGET_MIN = 0;
const BUDGET_MAX = 100;

export default function MultiFilters() {
  const [ratingRange, setRatingRange] = useState([RATING_MIN, RATING_MAX]);
  const [ratingDisplayRange, setRatingDisplayRange] = useState([
    RATING_MIN,
    RATING_MAX,
  ]);
  const [reviewRange, setReviewRange] = useState([REVIEW_MIN, REVIEW_MAX]);
  const [reviewDisplayRange, setReviewDisplayRange] = useState([
    REVIEW_MIN,
    REVIEW_MAX,
  ]);
  const [lunchRange, setLunchRange] = useState([BUDGET_MIN, BUDGET_MAX]);
  const [lunchDisplayRange, setLunchDisplayRange] = useState([
    BUDGET_MIN,
    BUDGET_MAX,
  ]);
  const [dinnerRange, setDinnerRange] = useState([BUDGET_MIN, BUDGET_MAX]);
  const [dinnerDisplayRange, setDinnerDisplayRange] = useState([
    BUDGET_MIN,
    BUDGET_MAX,
  ]);
  const [storeName, setStoreName] = useState("");
  const [sortValue, setSortValue] = useState();
  const [prefectureValue, setPrefectureValue] = useState();
  const [genreValue, setGenreValue] = useState();
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
  const baseUrl = "https://tabelog-backend.onrender.com/";

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems([]);
    setPage(1);
  }, [
    storeName,
    sortValue,
    genreValue,
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
    genreValue,
    prefectureValue,
    ratingRange,
    reviewRange,
    lunchRange,
    dinnerRange,
    page,
  ]);

  const filterItems = async () => {
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

    setLoading(true);
    setError(false);
    let cancel;
    axios
      .get(baseUrl + "restaurants/english", {
        params: {
          store_name: storeName,
          sort_value: sortValue,
          genre_value: genreValue,
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
              ...responses.data.map((response) => response).flat(),
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
                      }).format(ratingDisplayRange[0] / 10)}`}{" "}
                      - Max Rating:{" "}
                      {`${new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(ratingDisplayRange[1] / 10)}`}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setRatingDisplayRange}
                    onAfterChange={setRatingRange}
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
                        reviewDisplayRange[0]
                      )}`}{" "}
                      - Max Review:{" "}
                      {`${new Intl.NumberFormat("en-IN", {}).format(
                        reviewDisplayRange[1]
                      )}`}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setReviewDisplayRange}
                    onAfterChange={setReviewRange}
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
                      }).format(lunchDisplayRange[0] * 1000)}{" "}
                      - Max Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(lunchDisplayRange[1] * 1000)}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setLunchDisplayRange}
                    onAfterChange={setLunchRange}
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
                      }).format(dinnerDisplayRange[0] * 1000)}{" "}
                      - Max Budget:
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      }).format(dinnerDisplayRange[1] * 1000)}
                    </span>
                  </div>

                  <Slider
                    className={"slider"}
                    onChange={setDinnerDisplayRange}
                    onAfterChange={setDinnerRange}
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

            <td size="8" className="genreFilter">
              <h2>Select Genre</h2>
              <Select options={genreOptions} onChange={setGenreValue} isMulti />
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

              <p className="genre">Genre: {genreReference[item.genre]}</p>
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
