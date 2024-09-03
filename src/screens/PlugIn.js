import React, { useEffect, useState } from 'react'
import axios from "axios"
import ConfirmationModal from "../component/ConfirmationModal"
import { Form, Input, Modal, InputNumber, message, Select } from 'antd'
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { MdCancel } from "react-icons/md";

function PlugIn() {
    const [form] = Form.useForm()
    const [pluginData, setPluginData] = useState(undefined)
    const [formatedPluginData, setFormatedPluginData] = useState(undefined)
    const [confirmationModalData, setConfirmationModalData] = useState({
        show: false,
        message: "",
        function: undefined,
        data: undefined
    })
    const [editCopyPluginModalData, setEditCopyPluginModalData] = useState({ show: false, data: null, index: undefined })
    const [symbolTranslationData, setSymbolTranslationData] = useState({ show: false, data: null })

    useEffect(() => {
        getPluginData()
    }, [])

    async function getPluginData() {
        // const res = {
        //     "Name": "CopyTraderPlugin",
        //     "Server": "1",
        //     "Module": "MetaCopyTrader.dll",
        //     "Enable": "1",
        //     "Flags": "1",
        //     "Params": [
        //         {
        //             "Type": "1",
        //             "Name": "conf_attempts_after_reject",
        //             "Value": "5"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_delay_after_reject",
        //             "Value": "1000"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_copy_on_startup",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_log_routes",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_copy_source_price",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_copy_sl_tp",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_custom_comment",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_copy_magic_number",
        //             "Value": "0"
        //         },
        //         {
        //             "Type": "1",
        //             "Name": "conf_round_up_to_min_volume",
        //             "Value": "1"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "CPR:17771:0:1",
        //             "Value": "[99982,99983]:FOK:0:75"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "CPR:29981:0:0",
        //             "Value": "[99982,99983]:IOC:3:75"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "CPR:3002:0:1:TEST",
        //             "Value": "[1003]:FOK:0:100"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "TLR:1:TEST",
        //             "Value": "{'EURUSD.fix':'EURUSD.r','GBPUSD.r':'GBPUSD.r'}"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "TLR:1:TEST2",
        //             "Value": "{'EURUSD.fix':'EURUSD.r','GBPUSD.r':'GBPUSD.r'}"
        //         },
        //         {
        //             "Type": "0",
        //             "Name": "TLR:1:TEST333",
        //             "Value": "{'EURUSD.fi':'EURUSD.r','GBPUSD.r':'GBPUSD.r','eee.r':'hhhh.r'}"
        //         }

        //     ]
        // }
        // setPluginData(res)
        // setFormatedPluginData(formatePluginData(res))

        const url = `${process.env.REACT_APP_BASE_URL}api/getPluginConfig`
        const body = {
            "server": 1,
            "name": "CopyTraderPlugin"
        }
        try {
            const res = await axios.post(url, body)
            if (res.data) {
                // res.data.response.answer[0]
                setPluginData(res.data.response.answer[0])
                setFormatedPluginData(formatePluginData(res.data.response.answer[0]))
            } else {

            }
        } catch (error) {
            console.log("fetch plugin data error")
        }


    }
    function formatePluginData(pluginData) {
        return {
            attempts_after_reject: pluginData.Params.find(x => x.Name === "conf_attempts_after_reject").Value,
            delay_after_reject: pluginData.Params.find(x => x.Name === "conf_delay_after_reject").Value,
            copy_on_startup: pluginData.Params.find(x => x.Name === "conf_copy_on_startup").Value === "1",
            log_routes: pluginData.Params.find(x => x.Name === "conf_log_routes").Value === "1",
            copy_sl_tp: pluginData.Params.find(x => x.Name === "conf_copy_sl_tp").Value === "1",
            round_up_to_min_volume: pluginData.Params.find(x => x.Name === "conf_round_up_to_min_volume").Value === "1",
            copy_source_price: pluginData.Params.find(x => x.Name === "conf_copy_source_price").Value === "1",
            custom_comment: pluginData.Params.find(x => x.Name === "conf_custom_comment").Value === "1",
            copy_magic_number: pluginData.Params.find(x => x.Name === "conf_copy_magic_number").Value === "1",
            copyPluginTableData: pluginData.Params.filter(x => x.Name.split(":")[0] === "CPR").map(y => {
                return {
                    source_acoount: y.Name.split(`:`)[1],
                    inverse: y.Name.split(`:`)[2],
                    target_acoounts: y.Value.split(`:`)[0].slice(1, y.Value.split(`:`)[0].length - 1),
                    fillType: y.Value.split(':')[1], //fok
                    mode: y.Value.split(`:`)[2],
                    mode_value: y.Value.split(":")[3],
                    active: y.Name.split(`:`)[3] === '1',
                    sltRule: y.Name.split(`:`)[4],
                }
            }),

            // "Type": "0",
            // "Name": "TLR:1:TEST",
            // "Value": "{'EURUSD.fix':'EURUSD.r','GBPUSD.r':'GBPUSD.r'}"
            // JSON.parse(x.Value)
            symbolTranslationRuleList: pluginData.Params.filter(x => x.Name.split(":")[0] === "TLR").map(y => {
                const replceComa = y.Value.replace(/'/g, '"')
                return {
                    name: y.Name.split(":")[2],
                    ruleArr: JSON.parse(replceComa)
                    // ruleArr: JSON.parse(y.Value)
                }
            }),
        }

    }

    function formatedPluginDataChange(fieldName, fieldValue) {
        console.log("fieldName>>", fieldName, "fieldValue>>", fieldValue)
        setFormatedPluginData((old) => {
            const newObj = {
                ...old
            }
            newObj[fieldName] = fieldValue
            return newObj
        })
    }

    function reverseFormatePluginData() {
        // pluginData
        let newPlugInData = [
            {
                "Type": "1",
                "Name": "conf_attempts_after_reject",
                "Value": formatedPluginData.attempts_after_reject
            },
            {
                "Type": "1",
                "Name": "conf_delay_after_reject",
                "Value": formatedPluginData.delay_after_reject
            },
            {
                "Type": "1",
                "Name": "conf_copy_on_startup",
                "Value": "1"
            },
            {
                "Type": "1",
                "Name": "conf_log_routes",
                "Value": formatedPluginData.log_routes ? "1" : "0"
            },
            {
                "Type": "1",
                "Name": "conf_copy_source_price",
                "Value": formatedPluginData.copy_source_price ? "1" : "0"
            },
            {
                "Type": "1",
                "Name": "conf_copy_sl_tp",
                "Value": formatedPluginData.copy_sl_tp ? "1" : "0"
            },
            {
                "Type": "1",
                "Name": "conf_custom_comment",
                "Value": formatedPluginData.custom_comment ? "1" : "0"
            },
            {
                "Type": "1",
                "Name": "conf_copy_magic_number",
                "Value": formatedPluginData.copy_magic_number ? "1" : "0"
            },
            {
                "Type": "1",
                "Name": "conf_round_up_to_min_volume",
                "Value": formatedPluginData.round_up_to_min_volume ? "1" : "0"
            },
        ]
        // "Type": "0",
        // "Name": "CPR:17771:0:1",
        // "Value": "[99982,99983]:FOK:0:75"
        formatedPluginData.copyPluginTableData.forEach(x => {
            newPlugInData.push({
                "Type": "0",
                "Name": `CPR:${x.source_acoount}:${x.inverse}:${x.active ? "1" : "0"}:${x.sltRule ? x.sltRule : null}`,
                "Value": `[${x.target_acoounts}]:${x.fillType}:${x.mode}:${x.mode_value}`
            })
        })

        // "Type": "0",
        // "Name": "TLR:1:TEST",
        // "Value": "{'EURUSD.fix':'EURUSD.r','GBPUSD.r':'GBPUSD.r'}"

        formatedPluginData.symbolTranslationRuleList.forEach(x => {
            newPlugInData.push({
                "Type": "0",
                "Name": `TLR:1:${x.name}`,
                "Value": `${JSON.stringify(x.ruleArr)}`
            })
        })

        return newPlugInData
    }

    function onCopyPluginActiveInactive(index, value) {
        const newCopyPluginData = formatedPluginData.copyPluginTableData.map((x, i) => {
            if (index === i) {
                return { ...x, active: value }
            } else {
                return x
            }
        })

        setFormatedPluginData((old) => {
            return { ...old, copyPluginTableData: newCopyPluginData }
        })

    }

    function onApplyChangeClick() {
        setConfirmationModalData({
            show: true,
            message: "Kidly confirm, Do you want to apply the changes ?",
            function: onApplyChange
        })
    }
    async function onApplyChange() {
        const url = `${process.env.REACT_APP_BASE_URL}api/editPluginParams`
        const body = { ...pluginData, Params: reverseFormatePluginData() }
        console.log("old data>>", pluginData)
        console.log("updated data>>", body)
        try {
            const res = await axios.post(url, body)
            if (res.data.status) {
                console.log("updated successfully")
                message.success('Plugin updated successfully')

            } else {
                console.log("updated request fail")
                message.error('Plugin updation fail')
            }
        } catch (error) {

        } finally {
            setConfirmationModalData({
                show: false,
                message: "",
                function: undefined,
                data: undefined
            })
        }
    }
    function onFinish(e) { }

    function onEditCopyPluginClick(index, pluginData) {
        setEditCopyPluginModalData({
            show: true,
            new: false,
            index
        })
    }

    // function onDeleteCopyPluginClick(index) { }
    function onDeleteCopyPluginClick(index) {
        setConfirmationModalData({
            show: true,
            message: "Kidly confirm, Do you want to delete the copy plugin ?",
            function: onDeleteCopyPlugin,
            data: index
        })
    }

    function onDeleteCopyPlugin(index) {
        console.log("delete confirem", index)
        try {
            const newCopyPluginDataPluginTableData = formatedPluginData.copyPluginTableData.filter((x, i) => i !== index)
            setFormatedPluginData((old) => {
                return { ...old, copyPluginTableData: newCopyPluginDataPluginTableData }
            })
        } catch (error) {
            console.log("delete copy plugin err>>", error)
        } finally {
            setConfirmationModalData({
                show: false,
                message: "",
                function: undefined,
                data: undefined
            })
        }

    }



    return (
        <div className='bg-gray-300 m-0 p-0'>
            <div className='mx-10 py-4'>
                <div className="flex justify-start mr-4 py-2 px-4 gap-2 bg-white shadow-lg">
                    <h1 className='text-lg text-start font-bold'>Plugins</h1>
                    <button className="bg-blue-600 text-white py-1 px-4 disabled:bg-slate-400 shadow-lg" onClick={onApplyChangeClick}>Apply</button>
                </div>
                <h1 className='text-lg text-start my-4'>General</h1>
                {
                    formatedPluginData && <>
                        <div className='flex justify-start items-center gap-2'>
                            <div className='flex flex-col justify-start items-start'>
                                <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Attempts after reject:</span>
                                <Input type='text' value={formatedPluginData.attempts_after_reject} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => formatedPluginDataChange("attempts_after_reject", e.target.value)} />
                            </div>
                            <div className='flex flex-col justify-start items-start'>
                                <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Delay after reject:</span>
                                <Input type='text' value={formatedPluginData.delay_after_reject} className='text-xl rounded-lg' placeholder='Delay after reject' onChange={(e) => formatedPluginDataChange("delay_after_reject", e.target.value)} />
                            </div>
                        </div>
                        <div className='w-full flex justify-start items-center gap-2 my-4'>
                            {/* <div className='flex flex-col justify-start items-start'>
                        <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Copy on starttup:</span>
                        <Input type='checkbox' checked={formatedPluginData.copy_on_startup} onChange={(e) => formatedPluginDataChange("copy_on_startup", e.target.checked)} className='text-xl rounded-lg' placeholder='Attempts after reject' />
                    </div> */}
                            <div className='flex justify-start items-baseline'>
                                <Input type='checkbox' checked={formatedPluginData.log_routes} className='w-[15px]' onChange={(e) => formatedPluginDataChange("log_routes", e.target.checked)} />
                                <div className='mb-2 text-sm font-medium text-slate-400 mx-1'>Log routes</div>
                            </div>
                            <div className='flex justify-start items-baseline'>
                                <Input type='checkbox' checked={formatedPluginData.copy_sl_tp} className='w-[15px]' onChange={(e) => formatedPluginDataChange("copy_sl_tp", e.target.checked)} />
                                <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Copy sl tp</span>
                            </div>
                            <div className='flex justify-start items-baseline'>
                                <Input type='checkbox' checked={formatedPluginData.round_up_to_min_volume} className='w-[15px]' onChange={(e) => formatedPluginDataChange("round_up_to_min_volume", e.target.checked)} />
                                <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Round up to min volume</span>
                            </div>
                            {/* <div className='flex flex-col justify-start items-start'>
                        <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Copy source price:</span>
                        <Input type='checkbox' checked={formatedPluginData.copy_source_price} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => formatedPluginDataChange("copy_source_price", e.target.checked)} />
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                        <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Custom comment:</span>
                        <Input type='checkbox' checked={formatedPluginData.custom_comment} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => formatedPluginDataChange("custom_comment", e.target.checked)} />
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                        <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Copy magic number:</span>
                        <Input type='checkbox' checked={formatedPluginData.copy_magic_number} className='text-xl rounded-lg' placeholder='Attempts after reject'  onChange={(e) => formatedPluginDataChange("copy_magic_number", e.target.checked)}/>
                    </div>
                     */}
                        </div>
                    </>
                }
                <div className="flex justify-start mr-4 py-2 px-4 gap-2 bg-white shadow-lg">
                    <h1 className='text-lg text-start font-bold '>Copy plugin table</h1>
                    <button className="bg-blue-600 text-white py-1 px-4 disabled:bg-slate-400 shadow-lg" onClick={() => {
                        setEditCopyPluginModalData({
                            show: true,
                            new: true,
                        })
                    }}>Add new copy plugin</button>
                </div>
                <div>
                    <div className='grid grid-cols-6 font-bold my-2 '>
                        <span>Source Account</span>
                        <span>Target Accounts</span>
                        <span>Mode</span>
                        <span>Mode Value</span>
                        <span>Active/Inactive</span>
                        <span>Action</span>
                    </div>
                    {
                        formatedPluginData &&
                        formatedPluginData.copyPluginTableData.map((x, i) => {
                            return <div key={i + x.source_acoount} className='grid grid-cols-6 my-1'>
                                <span>{x.source_acoount}</span>
                                <span>{x.target_acoounts}</span>
                                <span>{x.mode === "0" ? "Volume Percent" : x.mode === "1" ? "Fixed Volume" : x.mode === "2" ? "Balance" : x.mode === "3" ? "Equity" : ""}</span>
                                <span>{x.mode_value}</span>
                                <span><Input type='checkbox' checked={x.active} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => onCopyPluginActiveInactive(i, e.target.checked)} />
                                </span>
                                <span>
                                    <div className='flex justify-center items-center gap-2'>
                                        <CiEdit className='text-lg' onClick={() => onEditCopyPluginClick(i, x)} />
                                        <MdDeleteOutline className='text-lg' onClick={() => onDeleteCopyPluginClick(i)} />
                                    </div>
                                </span>
                            </div>
                        })
                    }

                </div>

                <div className="flex justify-start mr-4 py-2 px-4 gap-2 bg-white shadow-lg">
                    <h1 className='text-lg text-start font-bold '>Symbol translation rule list</h1>
                    <button className="bg-blue-600 text-white py-1 px-4 disabled:bg-slate-400 shadow-lg" onClick={() => {
                        setSymbolTranslationData({
                            show: true,
                            new: true,
                            data: undefined
                        })
                    }}>Add new Symbol translation rule</button>
                </div>
                <div className='flex justify-start items-start gap-4 flex-wrap my-4'>
                    {formatedPluginData?.symbolTranslationRuleList && formatedPluginData?.symbolTranslationRuleList.map((x, i) => {
                        return (
                            <div key={x.name + i} className='w-[250px] bg-white p-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='font-bold'>{x.name}</span>
                                    <div className='flex justify-start items-center gap-2'>
                                        <CiEdit onClick={() => setSymbolTranslationData({ show: true, data: x, index: i })} />
                                        <MdDeleteOutline />
                                    </div>
                                </div>
                                <div className='flex flex-col justify-start items-start'>
                                    {Object.keys(x.ruleArr).map(y => {
                                        return <span key={y}>{y}:{x.ruleArr[y]}</span>
                                    })}
                                </div>
                            </div>)
                    })}

                </div>


                <EditCopyPluginModal pluginData={editCopyPluginModalData} setPluginData={setEditCopyPluginModalData} formatedPluginData={formatedPluginData} setFormatedPluginData={setFormatedPluginData} />
                <EditSymbolTranslationModal show={symbolTranslationData.show} data={symbolTranslationData.data} setData={setSymbolTranslationData} createNew={symbolTranslationData.new} formatedPluginData={formatedPluginData} setFormatedPluginData={setFormatedPluginData} ruleListIndex={symbolTranslationData.index} />
                <ConfirmationModal show={confirmationModalData.show} setShow={setConfirmationModalData} message={confirmationModalData.message} onConfirmFunction={confirmationModalData.function} data={confirmationModalData.data} />
            </div >
        </div>
    )
}

function EditCopyPluginModal({ pluginData, setPluginData, formatedPluginData, setFormatedPluginData }) {
    const [newPluginData, setNewPluginData] = useState(undefined)
    const [targetAcc, setTargetAcc] = useState(undefined)
    const [target_acoounts, settarget_acoounts] = useState([])
    const [errors, setErrors] = useState({})
    const [errCheck, setErrCheck] = useState(false)
    const [sltRuleOption, setSltRuleOption] = useState([])

    useEffect(() => {
        if (pluginData.show) {
            if (pluginData.new) {
                settarget_acoounts([])
                setNewPluginData({
                    source_acoount: "",
                    inverse: "0",
                    target_acoounts: "",
                    fillType: "FOK", //fok
                    mode: "0",
                    mode_value: "",
                    active: "1"
                })

            } else {
                settarget_acoounts(formatedPluginData.copyPluginTableData[pluginData.index].target_acoounts.split(","))
                setNewPluginData(formatedPluginData.copyPluginTableData[pluginData.index])
            }

            const newSymbolOption = formatedPluginData.symbolTranslationRuleList.map(x => {
                return { value: x.name, label: x.name }
            })
            setSltRuleOption(newSymbolOption)
        }


    }, [pluginData.show])

    function onValueChange(fieldName, fieldValue) {
        console.log("fieldName>>", fieldName, "fieldValue>>", fieldValue)
        setNewPluginData((old) => {
            const newObj = {
                ...old
            }
            newObj[fieldName] = fieldValue
            return newObj
        })
    }

    useEffect(() => {
        updateError()
    }, [newPluginData])

    function updateError() {
        console.log("update err run", newPluginData)
        if (!newPluginData?.source_acoount || newPluginData?.source_acoount === "") {
            setErrors((old) => {
                return { sourceErr: "add source account!" }
            })
            return setErrCheck(true)
        } else if (target_acoounts.length < 1) {
            setErrors((old) => {
                return { targetErr: "add target account!" }
            })
            return setErrCheck(true)
        } else if (!newPluginData?.mode_value || newPluginData?.mode_value === "") {
            setErrors((old) => {
                return { mode_valueErr: "add mode value!" }
            })
            return setErrCheck(true)
        } else {
            setErrors({})
            return setErrCheck(false)
        }
    }

    function onAddNewTargetAcc() {
        if (!targetAcc || targetAcc === "" || targetAcc === " ") {
            return
        }
        settarget_acoounts((old) => { return [...old, targetAcc] })

        setNewPluginData((old) => {
            return { ...old, target_acoounts: [...target_acoounts, targetAcc].join(","), }
        })
        setTargetAcc("")
    }
    function onRemoveTargetAcc(acc) {
        const newtarget_acoounts = target_acoounts.filter(x => x != acc)
        settarget_acoounts(newtarget_acoounts)
        setNewPluginData((old) => {
            return { ...old, target_acoounts: newtarget_acoounts.join(","), }
        })
    }

    function onSubmit() {
        let newCopyPluginDataTable
        // console.log("on submit new newPluginData>>", newPluginData)
        // create new
        if (pluginData.new) {
            newCopyPluginDataTable = formatedPluginData.copyPluginTableData
            newCopyPluginDataTable.push(newPluginData)
        } else {
            console.log(" formatedPluginData>>", formatedPluginData)
            newCopyPluginDataTable = formatedPluginData.copyPluginTableData.map((x, i) => {
                if (pluginData.index === i) {
                    return newPluginData
                } else {
                    return x
                }
            })
        }
        console.log("newCopyPluginDataTable>>", newCopyPluginDataTable)
        setFormatedPluginData((old) => {
            return { ...old, copyPluginTableData: newCopyPluginDataTable }
        })
        setPluginData({ show: false, data: null, index: undefined })
    }

    return <Modal
        title={"Edit copy plugin"}
        open={pluginData.show}
        // onOk={onConfirmFunction}
        onCancel={() => setPluginData({ show: false, data: null, index: undefined })}
        footer={false}
    >
        {/* {JSON.stringify(pluginData.data)} */}
        {/* {JSON.stringify(newPluginData)} */}
        {newPluginData &&
            <>

                <div className='flex flex-col justify-start items-start my-2'>
                    {/* {JSON.stringify(newPluginData)} */}
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Source Acoount:</span>
                    <Input type='text' value={newPluginData.source_acoount} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => onValueChange("source_acoount", e.target.value)} />
                    {errors?.sourceErr && <span className='text-xm text-red-600'>{errors?.sourceErr}</span>}
                </div>
                <div className='flex flex-col justify-start items-start my-2'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Source Acoount:</span>
                    <div className='flex justify-start items-center gap-2'>
                        <Input type='number' value={targetAcc} className='text-xl rounded-lg' placeholder='Attempts after reject' onChange={(e) => setTargetAcc(e.target.value)} />
                        <button className='bg-blue-600 text-white py-1 px-4 my-2 disabled:bg-slate-400 shadow-lg rounded-lg' onClick={onAddNewTargetAcc}>add</button>
                    </div>
                    {errors?.targetErr && <span className='text-xm text-red-600'>{errors?.targetErr}</span>}
                    <div className='flex justify-start items-center gap-2'>
                        {target_acoounts.map((x, i) => <div className='flex justify-start items-center'><span key={x + i} className='mx-2'>{x}</span><MdCancel onClick={() => onRemoveTargetAcc(x)} /> </div>)}
                    </div>

                </div>
                <div className='flex flex-col justify-start items-start my-2'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Fill Type:</span>
                    <Select options={[
                        {
                            value: 'FOK',
                            label: 'FOK',
                        },
                        {
                            value: 'IOC',
                            label: 'IOC',
                        },]} disabled value={newPluginData.fillType} defaultValue={newPluginData.fillType} />
                </div>
                <div className='flex flex-col justify-start items-start my-2'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>MODE:</span>
                    <Select options={[
                        {
                            value: '0',
                            label: 'Volume Percent',
                        },
                        {
                            value: '1',
                            label: 'Fixed Volume',
                        },
                        {
                            value: '2',
                            label: 'Balance',
                        },
                        {
                            value: '3',
                            label: 'Equity',
                        },

                    ]}
                        value={newPluginData.mode} defaultValue={newPluginData.mode} onChange={(e) => onValueChange("mode", e)} />
                </div>
                <div className='flex flex-col justify-start items-start my-2'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Mode Value:</span>
                    <Input type='text' value={newPluginData.mode_value} className='text-xl rounded-lg' onChange={(e) => onValueChange("mode_value", e.target.value)} />
                    {errors?.mode_valueErr && <span className='text-xm text-red-600'>{errors?.mode_valueErr}</span>}
                </div>
                {/* sltRule */}
                <div className='flex flex-col justify-start items-start my-2'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Symbol Translation Rule:</span>
                    <Select options={sltRuleOption} className='w-[200px]'
                        value={newPluginData.sltRule} defaultValue={newPluginData.sltRule} onChange={(e) => onValueChange("sltRule", e)} />
                </div>
                <div className='flex flex-col justify-start items-start my-2'>
                    <div className='w-full flex justify-start items-center'>
                        <Input type='checkbox' checked={newPluginData.inverse === "1" ? true : false} className='w-[25px]' onChange={(e) => onValueChange("inverse", e.target.checked ? "1" : "0")} />
                        <div className='w-full'>Open in opposite direction</div>
                    </div>
                </div>
                <div>
                    <button disabled={errCheck} className='bg-blue-600 text-white py-1 px-4 disabled:bg-slate-400 shadow-lg' onClick={onSubmit}>Submit</button>
                </div>
            </>}

    </Modal>
}

function EditSymbolTranslationModal({ show, data, setData, createNew, formatedPluginData, setFormatedPluginData, ruleListIndex }) {
    const [newData, setNewData] = useState(undefined)
    const [errors, setErrors] = useState(undefined)
    const [errCheck, setErrCheck] = useState(false)
    useEffect(() => {
        console.log("rcv data>>", data)
        if (data) {
            const newRuleObjArr = []
            Object.keys(data.ruleArr).forEach(x => {
                const newRuleObj = {
                    key: x,
                    value: data.ruleArr[x]
                }
                newRuleObjArr.push(newRuleObj)
            })
            setNewData({ ...data, ruleArr: newRuleObjArr })
        }
        if (createNew) {
            setNewData({
                name: "",
                ruleArr: [{ key: "", value: "" }]

            })
        }
    }, [show])


    function onValueChange(fieldName, fieldValue, index) {
        console.log("fieldName>>>", fieldName, "fieldValue>>", fieldValue, "index>>", index)

        if (fieldName === "key") {
            const newRuleArr = newData.ruleArr.map((x, i) => {
                if (i === index) {
                    console.log("new x", { key: fieldValue, value: x.value })
                    return { key: fieldValue, value: x.value }
                } else {
                    return x
                }
            })
            setNewData((old) => {
                return {
                    ...old, ruleArr: newRuleArr
                }
            })
            return
        }
        if (fieldName === "value") {
            const newRuleArr = newData.ruleArr.map((x, i) => {
                if (i === index) {
                    return { key: x.key, value: fieldValue }
                } else {
                    return x
                }
            })
            setNewData((old) => {
                return {
                    ...old, ruleArr: newRuleArr
                }
            })
            return
        }

        setNewData((old) => {
            const newObj = {
                ...old
            }
            newObj[fieldName] = fieldValue
            return newObj
        })
    }

    useEffect(() => {
        updateError()
    }, [newData])

    function updateError() {
        console.log("update err run", newData)
        if (!newData?.name || !newData?.name === "") {
            setErrors((old) => {
                return { nameErr: "add name field!" }
            })
            return setErrCheck(true)
        }
        else if (newData?.ruleArr.length < 1) {
            setErrors((old) => {
                return { ruleArrErr: "add atleast one rule!" }
            })
            return setErrCheck(true)
        } else if (checkEmptyKeyValue(newData?.ruleArr)) {
            setErrors((old) => {
                return { ruleArrErr: "add proper rule key value fields!" }
            })
            return setErrCheck(true)
        }
        else {
            setErrors({})
            return setErrCheck(false)
        }
    }

    function checkEmptyKeyValue(arr) {
        const emptyKey = arr.find(x => x.key === "")
        const emptyValue = arr.find(x => x.value === "")
        if (emptyKey || emptyValue) {
            return true
        }
    }

    function onAddNewRule() {
        const newRuleArr = [...newData.ruleArr, { key: "", value: "" }]
        setNewData((old) => {
            return {
                ...old, ruleArr: newRuleArr
            }
        })

    }
    function onRemoveRule(index) {
        const newRuleArr = newData.ruleArr.filter((x, i) => i !== index)
        setNewData((old) => {
            return {
                ...old, ruleArr: newRuleArr
            }
        })
    }

    function onSubmit() {
        console.log("submit value>>", newData)

        const formateRuleObj = {}
        newData.ruleArr.forEach(x => {
            formateRuleObj[x.key] = x.value
        })

        const finalData = { ...newData, ruleArr: formateRuleObj }


        let newSymblolTranslationList
        if (createNew) {
            newSymblolTranslationList = formatedPluginData.symbolTranslationRuleList
            newSymblolTranslationList.push(finalData)
        } else {
            newSymblolTranslationList = formatedPluginData.symbolTranslationRuleList.map((x, i) => {
                if (ruleListIndex === i) {
                    return finalData
                } else {
                    return x
                }
            })
        }


        setFormatedPluginData((old) => {
            return { ...old, symbolTranslationRuleList: newSymblolTranslationList }
        })
        setData({ show: false, data: null, index: undefined })
    }
    return <Modal
        title={"Edit copy plugin"}
        open={show}
        onCancel={() => setData({ show: false, data: null, index: undefined })}
        footer={false}
    >
        {/* {JSON.stringify(newData)} */}
        {newData &&
            <div>
                <div className='flex flex-col justify-start items-start'>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1'>Name:</span>
                    <Input type='text' value={newData.name} onChange={(e) => onValueChange("name", e.target.value)} />
                    {errors?.nameErr && <span className='text-xm text-red-600'>{errors?.nameErr}</span>}
                </div>
                <div>
                    <span className='block mb-2 text-sm font-medium text-slate-400 mx-1 my-2'>Rules:</span>
                    {
                        newData.ruleArr.map((x, i) => {
                            return <div className='flex justify-start items-center gap-2'>
                                <Input type='text' value={x.key} onChange={(e) => onValueChange("key", e.target.value, i)} />
                                <Input type='text' value={x.value} onChange={(e) => onValueChange("value", e.target.value, i)} />
                                <MdCancel className='text-[40px]' onClick={() => onRemoveRule(i)} />
                            </div>
                        })
                    }
                    {errors?.ruleArrErr && <span className='text-xm text-red-600'>{errors?.ruleArrErr}</span>}
                </div>
                <div>
                    <button className='bg-blue-600 text-white py-1 px-4 my-2 disabled:bg-slate-400 shadow-lg' onClick={onAddNewRule}>add new rule</button>
                </div>
                <div>
                    <button disabled={errCheck} className='bg-blue-600 text-white py-1 px-4 disabled:bg-slate-400 shadow-lg' onClick={onSubmit}>Submit</button>
                </div>
            </div>
        }

    </Modal >
}

export default PlugIn
