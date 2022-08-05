( () => {
    "use strict;"
    ///Constant Variables
    const chessBoard = document.getElementById('chessBoard');
    const squares = document.getElementsByTagName('p');
    const html = document.getElementsByTagName('html');
    const body = document.getElementsByTagName('body');
    const PIECES = {
        'R' : 'img/whiteRook.png',
        'N' : 'img/whiteKnight.png',
        'B' : 'img/whiteBishop.png',
        'Q' : 'img/whiteQueen.png',
        'K' : 'img/whiteKing.png',
        'P' : 'img/whitePawn.png',
        'r' : 'img/blackRook.png',
        'n' : 'img/blackKnight.png',
        'b' : 'img/blackBishop.png',
        'q' : 'img/blackQueen.png',
        'k' : 'img/blackKing.png',
        'p' : 'img/blackPawn.png',
    }
    
    //Variables used for determining if a King can castle and the sqaures used for castiling
    let whiteKingMoved = false;  
    let blackKingMoved = false;
    
    
    //Forsyth-Edwards Notation; lower case denotes black, uppercase denotes white and numbers denote number of empty squares
    const startingFEN = 'rnbqkbnr\\pppppppp\\8\\8\\8\\8\\PPPPPPPP\\RNBQKBNR'; 
    //const startingFEN = '8\\8\\8\\3bn3\\q2RB3\\8\\7k\\2B5';  //used for testing out piece movement
    
    let squareIndex = 0; //Used for helping iterate through the Chess Squares
    
    //Creating the 8x8 Chessboard
    for(let rank = 0; rank < 8; rank++){
        for(let file = 0; file < 8; file++){
            let square = document.createElement('p');
            chessBoard.appendChild(square);
            if((rank + file) % 2 === 0){
                square.style.backgroundColor = '#8BA8F7';
            }else{
                square.style.backgroundColor = '#E7ECF9';
            }
            square.className = 'square';
            squareIndex++;
        }
        
    }
     

    function loadingFEN(fenString) {
        fenString = fenString.replace(/\\/g, '');
        squareIndex = 0;
        for(let index of fenString){
            let chessPiece = new Image();
            if(parseInt(index)){
                squareIndex += parseInt(index);
            }else{
                chessPiece.src = PIECES[index];
                chessPiece.className = index;
                squares[squareIndex].appendChild(chessPiece);
                squareIndex++;
            }
            
        }
        squareIndex = 0;
    }
    
    loadingFEN(startingFEN);
    
    let whitePawns = document.querySelectorAll('.P');
    let blackPawns = document.querySelectorAll('.p');
    
    let whitePawnStart = new Array();
    let blackPawnStart = new Array();
    //Used to determine if a pawn can move forward one or two spaces
    for(let i = 0; i< whitePawns.length; i++){
        let parent = whitePawns[i].parentNode;
        let parent2 = blackPawns[i].parentNode;
        whitePawnStart.push(parent);
        blackPawnStart.push(parent2);
    }
    
    
    chessBoard.addEventListener('pointerdown', (e) =>  {
        e.target.ondragstart = () => {
            return false;
        };
        if(e.target.tagName === "P"){
            return false;
        }
        e.target.setPointerCapture(e.pointerId)
        e.target.style.touchAction = 'none';
        let parent = e.target.parentNode;
        let type = e.target.className;
        if(type.toLowerCase() === 'b'){
            displayLegalBishopMove(e);
        }
        if(type.toLowerCase() === 'r'){
            displayLegalRookMove(e);
        }
        if(type.toLowerCase() === 'q'){
            displayLegalRookMove(e);
            displayLegalBishopMove(e);
        }
        if(type.toLowerCase() === 'n'){
            displayLegalKnightMove(e);
        }
        if(type.toLowerCase() === 'k'){
            displayLegalKingMove(e);
        }
        if(type.toLowerCase() === 'p'){
            displayLegalPawnMove(e);
        }
        
        chessBoard.addEventListener('pointerup', dropPiece);
        chessBoard.addEventListener('pointermove', movePiece);
        
        function displayLegalBishopMove(e){
            const vertical = e.target.parentElement.clientHeight;
            const horizontal = e.target.parentElement.clientWidth;
            let oldX = e.target.parentElement.getBoundingClientRect().left;
            let oldY = e.target.parentElement.getBoundingClientRect().top;
            let westX = oldX - horizontal;
            let eastX = oldX + horizontal;
            let southY = oldY +vertical;
            let northY = oldY - vertical;
            let position;
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(westX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e,position);
                        break
                    }
                }
                westX -= horizontal;
                southY += vertical;
            }
            
            westX = oldX - horizontal;
            southY = oldY + vertical;    
            
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(eastX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e,position);
                        break
                    }
                }
                eastX += horizontal;
                southY += vertical;
            }
            
            eastX = oldX + horizontal;
                
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(eastX,northY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e,position);
                        break
                    }
                }
                eastX += horizontal;
                northY -= vertical;
            }
            
            northY = oldY - vertical;
                
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(westX,northY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e,position);
                        break
                    }
                }
                westX -= vertical;
                northY -= horizontal;
            }     
            
        }
        
        function displayLegalRookMove(e){
            const diagonal = e.target.parentElement.clientHeight; 
            let oldX = e.target.parentElement.getBoundingClientRect().left; 
            let oldY = e.target.parentElement.getBoundingClientRect().top; 
            let westX = oldX - diagonal;
            let eastX = oldX + diagonal;
            let southY = oldY + diagonal;
            let northY = oldY - diagonal;
            let position;
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(westX,oldY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e, position);
                        break
                    }
                    westX -= diagonal;
                }
            }
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(eastX,oldY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e, position);
                        break
                    }
                    eastX += diagonal;
                }
            }
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(oldX,northY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e, position);
                        break
                    }
                    northY -= diagonal;
                }
            }
            for(let i = 0; i < 8; i++){
                position = document.elementFromPoint(oldX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    if(position.hasChildNodes()){
                        checkCapture(e, position);
                        break
                    }
                    southY += diagonal;
                }
            }
                
        }
        
        function displayLegalKnightMove(e){
            const diagonal = e.target.parentElement.clientHeight; 
            let oldX = e.target.parentElement.getBoundingClientRect().left; 
            let oldY = e.target.parentElement.getBoundingClientRect().top; 
            let position;
            
            position = document.elementFromPoint((oldX + diagonal),(oldY-diagonal*2));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX - diagonal),(oldY-diagonal*2));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX + diagonal),(oldY+diagonal*2));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX - diagonal),(oldY+diagonal*2));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX + diagonal*2),(oldY-diagonal));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX - diagonal*2),(oldY-diagonal));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX + diagonal*2),(oldY+diagonal));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint((oldX - diagonal*2),(oldY+diagonal));
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
        }
        
        function displayLegalKingMove(e){
            const vertical = e.target.parentElement.clientHeight;
            const horizontal = e.target.parentElement.clientWidth;
            let oldX = e.target.parentElement.getBoundingClientRect().left;
            let oldY = e.target.parentElement.getBoundingClientRect().top;
            let westX = oldX - vertical;
            let eastX = oldX + vertical;
            let southY = oldY + horizontal;
            let northY = oldY - horizontal;
            let position;
            let kingSideCastleSquare;
            let queenSideCastleSquare;
            
            position = document.elementFromPoint(westX,southY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            position = document.elementFromPoint(eastX,southY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint(eastX,northY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint(westX,northY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint(westX,oldY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            position = document.elementFromPoint(eastX,oldY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint(oldX,northY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            position = document.elementFromPoint(oldX,southY);
            if(position !== null && position !== body[0] && position !== html[0]){
                position.classList.add('allowed');
                if(position.hasChildNodes()){
                    checkCapture(e, position);
                }
            }
            
            //Whether a king can legally castle
            if(type === 'K'){
                if(whiteKingMoved === false){
                    position = document.elementFromPoint(eastX,oldY);
                    if(!position.hasChildNodes()){
                        kingSideCastleSquare = document.elementFromPoint((eastX + horizontal),oldY)
                        if(!kingSideCastleSquare.hasChildNodes()){
                            kingSideCastleSquare.classList.add('allowed');
                        }
                    }
                    position = document.elementFromPoint(westX,oldY);
                    if(!position.hasChildNodes()){
                        position = document.elementFromPoint(westX - horizontal,oldY);
                        if(!position.hasChildNodes()){
                            position = document.elementFromPoint(westX - (horizontal*2),oldY);
                             if(!position.hasChildNodes()){
                                queenSideCastleSquare = document.elementFromPoint(westX - horizontal,oldY);
                                queenSideCastleSquare.classList.add('allowed');
                             }
                        }
                    }
                }
            }
            
            if(type === 'k'){
                if(blackKingMoved === false){
                    position = document.elementFromPoint(eastX,oldY);
                    if(!position.hasChildNodes()){
                        kingSideCastleSquare = document.elementFromPoint((eastX + horizontal),oldY)
                        if(!kingSideCastleSquare.hasChildNodes()){
                            kingSideCastleSquare.classList.add('allowed');
                        }
                    }
                    position = document.elementFromPoint(westX,oldY);
                    if(!position.hasChildNodes()){
                        position = document.elementFromPoint(westX - horizontal,oldY);
                        if(!position.hasChildNodes()){
                            position = document.elementFromPoint(westX - (horizontal*2),oldY);
                            if(!position.hasChildNodes()){
                                queenSideCastleSquare = document.elementFromPoint(westX - horizontal,oldY);
                                queenSideCastleSquare.classList.add('allowed');
                            }
                        }
                    }
                }
            }
            
        }
        
        //Whether or not a king has castling rights
        function hasKingMoved(e, type, clone){
            if(type === 'K'){
                if(clone.parentNode !== e.target.parentNode){
                    return whiteKingMoved = true;
                }
            }
            if(type === 'k'){
                if(clone.parentNode !== e.target.parentNode){
                    return blackKingMoved = true;
                }
            }
            
            return false;
        }
        
        function castleTheKing(e, clone){
            const horizontal = e.target.parentElement.clientWidth;
            const startSquare = e.target.parentElement;
            const whiteKingSideCastleSquare = squares[62];
            const whiteKingSideRookStartSquare = squares[63];
            const whiteKingSideRookCastleSquare = squares[61];
            const whiteQueenSideCastleSquare = squares[58];
            const whiteQueenSideRookStartSquare = squares[56];
            const whiteQueenSideRookCastleSquare = squares[59];
            const blackKingSideCastleSquare = squares[6];
            const blackKingSideRookStartSquare = squares[7];
            const blackKingSideRookCastleSquare = squares[5];
            const blackQueenSideCastleSquare = squares[2];
            const blackQueenSideRookStartSquare = squares[0];
            const blackQueenSideRookCastleSquare = squares[3];
            let rookClone;
            if(e.target.className === 'K'){
                if(whiteKingMoved === true){
                    console.log('Can\'t castle');
                    return
                }
                
                if(clone.parentElement === whiteKingSideCastleSquare){
                    rookClone = whiteKingSideRookStartSquare.children[0].cloneNode(true);
                    whiteKingSideRookStartSquare.children[0].remove();
                    whiteKingSideRookCastleSquare.append(rookClone);
                }
                
                if(clone.parentElement === whiteQueenSideCastleSquare){
                    rookClone = whiteQueenSideRookStartSquare.children[0].cloneNode(true);
                    whiteQueenSideRookStartSquare.children[0].remove();
                    whiteQueenSideRookCastleSquare.append(rookClone);
                }
                
            }
            
            if(e.target.className === 'k'){
                if(blackKingMoved === true){
                    console.log('Can\'t castle');
                    return
                }
                
                if(clone.parentElement === blackKingSideCastleSquare){
                    rookClone = blackKingSideRookStartSquare.children[0].cloneNode(true);
                    blackKingSideRookStartSquare.children[0].remove();
                    blackKingSideRookCastleSquare.append(rookClone);
                }
                
                if(clone.parentElement === blackQueenSideCastleSquare){
                    rookClone = blackQueenSideRookStartSquare.children[0].cloneNode(true);
                    blackQueenSideRookStartSquare.children[0].remove();
                    blackQueenSideRookCastleSquare.append(rookClone);
                }
                
            }
            
        }
        
        function displayLegalPawnMove(e){
            const vertical = e.target.parentElement.clientHeight;
            const horizontal = e.target.parentElement.clientWidth;
            let hasMoved = e.target.classList;
            let blackOrWhite = e.target.className;
            let oldX = e.target.parentElement.getBoundingClientRect().left;
            let oldY = e.target.parentElement.getBoundingClientRect().top;
            let westX = oldX - vertical;
            let eastX = oldX + vertical;
            let southY = oldY + horizontal;
            let northY = oldY - horizontal;
            let position;
            if(blackOrWhite === 'P'){
                position = document.elementFromPoint(oldX,northY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed')
                    for(let i = 0; i < whitePawnStart.length; i++){
                        if(parent === whitePawnStart[i]){
                            northY -=vertical;
                            position = document.elementFromPoint(oldX,northY);
                            position.classList.add('allowed');
                            return
                        }
                    }
                }
                
                position = document.elementFromPoint(oldX,northY)
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.remove('allowed');
                    }
                }
                
                position = document.elementFromPoint(westX,northY)
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.add('allowed');
                        checkCapture(e, position);
                    }
                }
                
                position = document.elementFromPoint(eastX,northY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.add('allowed');
                        checkCapture(e, position);
                    }
                }
                
                
            }
            
            if(blackOrWhite === 'p'){
                position = document.elementFromPoint(oldX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    position.classList.add('allowed');
                    for(let i = 0; i < whitePawnStart.length; i++){
                        if(parent === blackPawnStart[i]){
                            southY +=vertical;
                            position = document.elementFromPoint(oldX,southY);
                            position.classList.add('allowed');
                            return
                        }
                    }
                }
                
                position = document.elementFromPoint(oldX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.remove('allowed');
                    }
                }
                
                position = document.elementFromPoint(eastX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.add('allowed');
                        checkCapture(e, position);
                    }
                }
                
                position = document.elementFromPoint(westX,southY);
                if(position !== null && position !== body[0] && position !== html[0]){
                    if(position.hasChildNodes()){
                        position.classList.add('allowed');
                        checkCapture(e, position);
                    }
                }
                
            }

        }
        
                     
        function checkCapture(e, position){ 
            const regex = new RegExp(/[A-Z]/)  //Checking for uppercase letter to denote if its a white piece
            let yourPiece = e.target.className;
            let captureType = position.children[0].className;
            if(regex.test(yourPiece) === regex.test(captureType)){
                position.classList.remove('allowed');
                return
            }      
            
        }
        
        function capturePiece(e, position, clone){
            if(position[2].classList.contains('allowed')){
                position[1].remove();
                position[2].appendChild(clone)
            }
        }
        
        function dropPiece(e) {
            let clone = e.target.cloneNode(true);
            let position = document.elementsFromPoint(e.clientX,e.clientY);
            clone.style.position = 'inherit';
            if(!position[1].classList.contains('allowed')){
                parent.appendChild(clone);
            }else{
                position[1].appendChild(clone);
            }
            capturePiece(e, position, clone);
            castleTheKing(e, clone);
            if(type === 'K'){
                hasKingMoved(e, type, clone);
            }
            if(type === 'k'){
                hasKingMoved(e, type, clone);
            }
            e.target.remove();
            chessBoard.removeEventListener('pointermove', movePiece);
            chessBoard.removeEventListener('pointerup', dropPiece);
            let allowed = document.querySelectorAll('.allowed');
            for(let square of allowed){
                square.classList.remove('allowed');
            }
        }
        
        function movePiece(e){
            e.target.style.position = 'absolute';
            e.target.style.maxHeight = 'inherit';
            e.target.style.left = e.pageX - e.target.offsetWidth / 2 + 'px';
            e.target.style.top = e.pageY - e.target.offsetHeight / 2 + 'px'; 
        }
    });
     
})();
