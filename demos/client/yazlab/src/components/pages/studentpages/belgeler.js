/* eslint-disable */ 
import { useState } from "react";
// import { useCreateStaj } from "../hooks/useCreateStaj";
import {variables} from '../../../Variables.js';
import { useEffect } from 'react';
// import {postInternshipAcceptanceForm} from '../hooks/useCreateStaj.js';
// import { json, useResolvedPath } from "react-router-dom";

function Belgeler() {

    const {user, role, id, accessToken, previousLogin} = JSON.parse(localStorage.getItem('user'));
    const [internship, setInternship] = useState([]);
    const [internshipInfo, setInternshipInfo] = useState([]);
    //const [count, setCount] = useState(0);
    const [data, setData] = useState("")
    const [evulationFile, setEvulationFile] = useState("");
    const [bookFile, setBookFile] = useState("");

    var count = 0;

    useEffect(
        // Effect from first render
        () => {
            fetch(variables.API_URL + "internships/getInternshipsByUserId/"+user.id, {
             headers: {
                 'Accept': 'application/json'
                 }
             })
            .then(response => response.json())
            .then(data => {
                console.log(data);       
                setInternship(data);
            });

        },
        [] // Never re-runs
    );

        // function zattirizortzort(id) {
        //     fetch(variables.API_URL+"internships/download/"+id, {
        //         headers: {
        //             'Accept': 'application/pdf'
        //             }
        //     });
        // }

    async function onChangeHandler (e) {
        const data = new FormData();
        await data.append('pdf', e.target.files[0]);
        setData(e.target.files[0]);
    }

    async function onChangeHandlerEvulationForm (e) {
        const data = new FormData();
        await data.append('evulationForm', e.target.files[0]);
        setEvulationFile(e.target.files[0]);
    }

    async function onChangeHandlerBookForm (e) {
        const data = new FormData();
        await data.append('bookForm', e.target.files[0]);
        setBookFile(e.target.files[0]);
    }
    

    async function sendPdf (internId) {
        const dataFile = new FormData();
        await dataFile.append('pdf', data);
        await fetch(variables.API_URL + "Internships/uploadAcceptanceForm?internId="+internId,{
            method: 'POST',
            body: dataFile
        });

    }

    async function sendAfterInternshipPdf (internId) {
        
        const data = new FormData();
        await data.append('evulationForm', evulationFile);
        await data.append('bookForm', bookFile);
        await fetch(variables.API_URL + "Internships/UploadAfterInternshipDoc?internId="+internId,{
            
            method: 'POST',
            body: data
        });

    }
    
    return (
        <>
        {internship.map(intern => 

            <>
            {intern.internshipExams!=0 ?
            <>
            {intern.internshipExams[0].passed==null? 
            <div className="card" style={{width: "45rem", marginTop: "20px", marginBottom: "20px", borderWidth: 3 }}>
            <div className="card-body">
                <h5 className="card-title">{intern.company.formalName}</h5>
                <h6>{intern.internshipType==1?"Staj 1":"Staj 2"}</h6>
                <p >Staj Id: {intern.id}</p>
                <b>Staj S??nav??n??z Onaylanm????t??r.</b>
                <p><b>S??nav Sorumlunuz:</b> {intern.internshipExams[0].teacher.user.firstName + " " + intern.internshipExams[0].teacher.user.lastName}</p>
                <p><b>S??nav Tarihiniz:</b> {(intern.internshipExams[0].examTime).substring(0,10)}</p>
            </div>
        </div>
                        
            : null}
            {intern.internshipExams[0].passed==false?
            <div className="card" style={{width: "45rem", marginTop: "20px", marginBottom: "20px", borderWidth: 3 }}>
                <div className="card-body">
                    <h5 className="card-title">{intern.company.formalName}</h5>
                    <h6>{intern.internshipType==1?"Staj 1":"Staj 2"}</h6>
                    <p >Staj Id: {intern.id}</p>
                    <h4 style={{color: "red"}}>STAJINIZ RED ED??LM????T??R.</h4>
                    
                </div>
            </div>        
            :null}
            {intern.internshipExams[0].passed==true?
            <>
                <div className="card" style={{width: "45rem", marginTop: "20px", marginBottom: "20px", borderWidth: 3 }}>
                    <div className="card-body">
                        <h5 className="card-title">{intern.company.formalName}</h5>
                        <h6>{intern.internshipType==1?"Staj 1":"Staj 2"}</h6>
                        <p >Staj Id: {intern.id}</p>
                        <b style={{color: "green"}}>STAJ SINAVINIZDA G??STERD??????N??Z B??Y??K ??ABA ??????N TE??EKK??R EDER??Z.</b>
                        <p>Kabul Edilen G??n Say??s??: {intern.internshipExams[0].acceptedWorkDay}</p>
                    </div>
                </div>
            </>
            :null}
            </>
            :
            
            <div className="card" style={{width: "45rem", marginTop: "20px", marginBottom: "20px", borderWidth: 3 }}>
            <div className="card-body">
                <h5 className="card-title">{intern.company.formalName}</h5>
                <h6>{intern.internshipType==1?"Staj 1":"Staj 2"}</h6>
                <p >Staj Id: {intern.id}</p>
                <p id="temp">{intern.internshipControlInfos.length>0?intern.internshipControlInfos[0].infoMessage:"NO INFO"}</p>
                <p className="card-text">Staj Id: {intern.id}</p>
                {intern.internshipControlInfos.length>0&&intern.internshipControlInfos[0].infoMessage=="ApplicationApproved"&&intern.internshipDocControls.length==0 ?
                <>
                <div class="bg-light rounded h-100 p-4">
                    <h6 class="mb-4">Staj Sonras?? PDF Y??kleme Alan??</h6>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Staj Kabul Formu:</label>
                        <input class="form-control" type="file" name="fileEvulation" id="formFileEvulation" onChange={onChangeHandlerEvulationForm}/>
                        <label for="formFile" class="form-label">Staj Defteri PDF:</label>
                        <input class="form-control" type="file" name="fileBook" id="formFileBook" onChange={onChangeHandlerBookForm}/>
                        <button type="button" class="btn btn-success rounded-pill m-2 float-right" style={{backgroundColor:"#009933"}} onClick={() => sendAfterInternshipPdf(intern.id)}>Ba??vuru Yap</button>                              
                    </div>
                </div>
                </>
                :null}
                {intern.internshipControlInfos.length==0||intern.internshipControlInfos[0].infoMessage=="ApplicationRejected" ?
                <>
                <a href={variables.API_URL+"Internships/download/"+intern.id} target="_blank" className="btn btn-primary" >??ndir</a>
                <div class="bg-light rounded h-100 p-4">
                    <h6 class="mb-4">Staj Ba??vuru Formu Y??kleme Alan??</h6>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Default file input example</label>
                        <input class="form-control" type="file" name="file" id="formFile" onChange={onChangeHandler}/>
                        <button type="button" class="btn btn-success rounded-pill m-2 float-right" style={{backgroundColor:"#009933"}} onClick={() => sendPdf(intern.id)}>Ba??vuru Yap</button>                              
                    </div>
                </div></>:
                <>
                    {intern.internshipDocControls.length==0?null:
                    <>
                    <p>BookPath: {intern.internshipDocControls[0].internshipsBookPath}</p>
                    <p>EvulationPath: {intern.internshipDocControls[0].evulationFormPath}</p>
                    <p>accepted: {intern.internshipDocControls[0].accepted? "Onayland??": "Onaylanmad??"}</p>
                    </>
                    }

                </>
                }
            </div>
            {console.log("c: "+count)}
        </div>
        }
        </>
            )}
            
         </>
    )
}

export default Belgeler;