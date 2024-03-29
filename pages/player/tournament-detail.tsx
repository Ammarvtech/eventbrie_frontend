import React, { useEffect, useState } from "react"
import style from "@/styles/scss/app.module.scss"
import Footer from "@/components/footer"
import Header from "@/components/header/header"
import TournamentHeader from "./tournamentDetail/tournamentHeader"
import TournamentContent from "./tournamentDetail/tournamentContent"
import { useRouter } from 'next/router';
import axios from "axios"
import { PhotoTeam01 } from "@/components/images"
import Cookies from "js-cookie"
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberData } from '../../states/actions/dashboard';
const TournamentDetail = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchMemberData());
	}, []);
	const profileData = useSelector((state) => state.dashboard.content);
	const isLoading = useSelector((state) => state.dashboard.isLoading);
	const router = useRouter()
	useEffect(() => {
		if (profileData?.role === 'organizer') {
			router.push("/organizer")
		}
	}, [profileData]);
	const [tournamentDetails, setTournamentDetails] = useState<any>([]);
	const [teams, setTeams] = useState<any>([]);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id !== undefined) {
			fetchData();
		}
	}, [id]);
	const handleTeams = (teams: any) => {

	}
	const fetchData = async () => {
		try {
			const response = await axios.get(process.env.API_URL + "/tournament-details/" + id, {});
			if (response.status === 200) {
				setTournamentDetails(response.data.data);
				setTeams(response.data.data.teams);
			}
		} catch (error) {
			console.log(error);
		}
	};
	if (!tournamentDetails) {
		return 'Loading...';
	}
	return (
		<>
			<Header pageTitle="Tournaments" />
			<section className={`${style.dashboard} ${style.organizer_detail}`} id={style.tournament_detail}>
				<div className={style.contain}>
					<div className={style.blk}>

						<TournamentHeader
							category={tournamentDetails?.category?.name}
							type={tournamentDetails?.tournament_type?.name}
							title={tournamentDetails?.title}
							start_date={tournamentDetails?.start_date}
							end_date={tournamentDetails?.end_date}
							schedule_time={tournamentDetails?.schedule_time}
							overview={tournamentDetails?.overview}
						/>
						{tournamentDetails?.teams?.length > 0 ?
							<TournamentContent
								teams={teams}
								handleTeams={handleTeams}
							/>
							: ''
						}

					</div>
				</div>
			</section>
			<Footer />
		</>
	)
}

export default TournamentDetail
