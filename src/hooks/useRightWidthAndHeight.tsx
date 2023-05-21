import { useMediaQuery } from "@mui/material"


    type breakPointKey = '1024px' | '768px' | '640px';
    
    type BreakPoints = {
        [key in breakPointKey]:[number,number]
        
    }
    

    function useRightWidthAndHeight (breakPoints : BreakPoints) {


        const isSmallerThan1280 = useMediaQuery('(max-width:1280px)')
        const isSmallerThan1024 = useMediaQuery('(max-width:1023px)')
        const isSmallerThan768 = useMediaQuery('(max-width:767px)')
        const isSmallerThan640 = useMediaQuery('(max-width:639px)')
        
       
        const breakPoint1024Width = isSmallerThan1024 ? breakPoints['768px'][0] /*345*/ : breakPoints['1024px'][0] /*605*/
        const rightWidth= isSmallerThan640 ? breakPoints['640px'][0] /*252*/: breakPoint1024Width

        const breakPoint1024Height = isSmallerThan1024 ? breakPoints['768px'][1]/*202*/ : breakPoints['1024px'][1] /*345*/
        const rightHeight = isSmallerThan640 ? breakPoints['640px'][1] /*141*/ : breakPoint1024Height

        return [rightWidth,rightHeight]
    }

    export default useRightWidthAndHeight