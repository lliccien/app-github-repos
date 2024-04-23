import { useEffect, useState } from "react";
import { gitHubApi } from "../../api/gitHubApi";
import { UserDetail } from "../components/UserDetail";
import { type GithubUserData } from "../../interfaces/GithubUser";
import { DataTableRepos } from "../components/DataTableRepos";
import { GithubRepo } from "../../interfaces/GithubRepo";
import { Button } from "primereact/button";
import { AxiosResponse } from "axios";

export const HomePage = () => {
  const [userData, setUserData] = useState({} as GithubUserData);
  const [userRepoData, setUserRepoData] = useState([] as GithubRepo[]);

  const isAuthenticated =
    sessionStorage.getItem("token") != undefined ||
    sessionStorage.getItem("token") != null
      ? true
      : false;

  useEffect(() => {
    if (isAuthenticated) {
      const getUserData = gitHubApi.get("/user");

      const getUserRepoData = (login: string) => {
        return gitHubApi.get(`/users/${login}/repos`);
      };

      getUserData
        .then((res: AxiosResponse<GithubUserData>) => {
          setUserData(res.data);
          getUserRepoData(res.data.login)
            .then((res: AxiosResponse<GithubRepo[]>) => {
              setUserRepoData(res.data);
            })
            .catch((err: Error) => {
              console.error(err);
            });
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div>
        <UserDetail data={userData} />
      </div>
      <div className="grid">
        <div className="col-6">
          <h2>Repositories</h2>
          <p>Click on the row to go to the repository on GitHub.</p>
        </div>

        <div className="col-6" style={{ textAlign: "right" }}>
          <Button label="Logout" onClick={handleLogout} />
        </div>
        <DataTableRepos data={userRepoData} />
      </div>
    </>
  );
};
