import { useState, useEffect } from "react";
import { Skeleton } from "antd-mobile";
import styles from "./index.module.scss";
import { course } from "../../api/index";
import { TabBarFooter, Empty } from "../../components";
import { CoursesModel } from "./compenents/courses-model";
import moment from "moment";

const StudyPage = () => {
  const [loading, setLoading] = useState(false);
  const [todayCourses, setTodayCourses] = useState<CourseModel[]>([]);
  const [yesterdayCourses, setYesterdayCourses] = useState<CourseModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);

  useEffect(() => {
    document.title = "最近学习";
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setLoading(true);
    course.latestLearn().then((res: any) => {
      let data = res.data;
      let today: CourseModel[] = [];
      let yesterday: CourseModel[] = [];
      let box: CourseModel[] = [];
      if (data && data.length > 0) {
        data.map((item: any) => {
          if (
            item.hour_record &&
            moment(item.hour_record.updated_at).isSame(moment(), "day")
          ) {
            today.push(item);
          } else if (
            item.hour_record &&
            moment(item.hour_record.updated_at).isSame(
              moment().subtract(1, "day"),
              "day"
            )
          ) {
            yesterday.push(item);
          } else {
            box.push(item);
          }
          setTodayCourses(today);
          setYesterdayCourses(yesterday);
          setCourses(box);
        });
      }
      setLoading(false);
    });
  };

  return (
    <div className="main-body">
      <div className={styles["title"]}>最近学习</div>
      <div className={styles["list-box"]}>
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div className={styles["item"]} key={i}>
              <Skeleton
                animated
                style={{
                  width: 100,
                  height: 75,
                  borderRadius: 8,
                  marginRight: 15,
                }}
              />
              <div className={styles["item-info"]}>
                <Skeleton animated style={{ width: "100%", height: 21 }} />
                <Skeleton animated style={{ width: "100%", height: 24 }} />
              </div>
            </div>
          ))}
        {!loading && courses.length === 0 && <Empty></Empty>}
        {!loading && (
          <>
            {todayCourses.length > 0 && (
              <>
                <div className={styles["label"]}>今日</div>
                {todayCourses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <CoursesModel
                        id={item.course.id}
                        title={item.course.title}
                        thumb={item.course.thumb}
                        isRequired={item.course.is_required}
                        record={item.record}
                      ></CoursesModel>
                    )}
                  </div>
                ))}
              </>
            )}
            {yesterdayCourses.length > 0 && (
              <>
                <div className={styles["label"]}>昨日</div>
                {yesterdayCourses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <CoursesModel
                        id={item.course.id}
                        title={item.course.title}
                        thumb={item.course.thumb}
                        isRequired={item.course.is_required}
                        record={item.record}
                      ></CoursesModel>
                    )}
                  </div>
                ))}
              </>
            )}
            {courses.length > 0 && (
              <>
                <div className={styles["label"]}>更早</div>
                {courses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <CoursesModel
                        id={item.course.id}
                        title={item.course.title}
                        thumb={item.course.thumb}
                        isRequired={item.course.is_required}
                        record={item.record}
                      ></CoursesModel>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default StudyPage;
