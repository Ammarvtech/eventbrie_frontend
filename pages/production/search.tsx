import React, { useState,useEffect } from "react"
import style from "@/styles/scss/app.module.scss"
import Header from "@/components/header/header"
import Footer from "@/components/footer"
import CategoryCard from "@/components/categoryCard"
import { PhotoBlog01, PhotoBlog02, PhotoBlog03 } from "@/components/images"
import { PhotoMainSlide } from "@/components/images"
import Pagination from "@/components/pagination"
import TopFilters from "./search/topFilters"
import MapBlock from "./search/mapBlock"
import axios from "axios"
import { useRouter } from "next/router"



const Search = () => {
	const [showMap, setShowMap] = useState(false)
	const [activeTab, setActiveTab] = useState('list');
	const [tournaments, setTournaments] = useState<any | null>([]);
	const [response, setResponse] = useState<any | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const params = useRouter().query;

	useEffect(() => {
		fetchTournaments();
	}, []);
	// get params from url
	
	const fetchTournaments = async () => {
	
		try {
			if(!params.categories && !params.postCode){
				const response = await axios.get(`${process.env.API_URL}/tournaments`);
				if (response.status === 200) {
					setTournaments(response.data.data.data);
					setResponse(response.data.data);
				}
				return;
			}
			const response = await axios.get(`${process.env.API_URL}/tournaments?category=${params.categories}&postal_code=${params.postCode}`);
			if (response.status === 200) {
				// console.log(response.data.data);
				setTournaments(response.data.data);
				setResponse(response.data.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	if (!tournaments) {
		return <div id={style.loader}></div>;
	}

	const showMapHandle = () => {
		setShowMap(!showMap)
	}
	return (
		<>
			<Header pageTitle="Search" />
			<section id={style.search}>
				<div className={style.contain}>
					<TopFilters  
						setActiveTab={setActiveTab} 
						activeTab={activeTab} 
						setTournaments={setTournaments as any}
						response={response}
						setResponse={setResponse as any}
						category={params.categories as string}
						postal_code={params.postCode as string}
					/>
					<div className={style.outer}>
						{activeTab === "list" && (
						<div className="w-100">
							<div className="row">
								{tournaments.map((data:any) => {
									return (
										<div className="col-lg-4 col-md-6 col-sm-4" key={data.id}>
											<CategoryCard 
												title={data.title}
												link="/production/tournament-detail"
												tag={data?.category?.name}
												date={data.start_date}
												text={'lorem ipsum'}
											
												img={process.env.ASSET_URL + data?.images[0]?.image}
											/>
										</div>
									)
								})}
							</div>
							<Pagination 
								response={response}
								setTournaments={setTournaments as any}
								setResponse={setResponse as any}
								category={params.categories as string}
								postal_code={params.postCode as string}
								setCurrentPage={setCurrentPage as any}
							/>
						</div>
						)}
						{activeTab === "map" && (
							<div className={`${style.map_blk} ${showMap ? style.active : ""} w-100`}>
								<MapBlock tournaments={tournaments}/>
							</div> 
						)}
					</div>
				</div>
				<div className={style.map_btn_blk}>
					<button type="button" className={`${style.site_btn} w-100`} onClick={showMapHandle}>
						{!showMap ? "Show Map" : "Hide Map"}
					</button>
				</div>
			</section>
			<Footer />
		</>
	)
}

export default Search
