import { style, transition, trigger, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(500, style({opacity: 1}))
      ]) 
    ])
  ]
})

export class GameComponent implements OnInit {
  timerDuration: any;
  gridSize = 10;
  cells: { row: number, col: number, state: 'normal' | 'player' | 'computer' | 'highlighted' }[] = [];
  playerScore: number = 0;
  computerScore: number = 0;
  timer: any;
  gameOver: boolean = false;
  winner: string = '';
  currentHighlightedCell: { row: number, col: number } = { row: -1, col: -1 };

  constructor() { 
    // Генерація масиву поля
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const row = Math.floor(i / this.gridSize);
      const col = i % this.gridSize;
      this.cells.push({ row, col, state: 'normal' });
    }
  }

  ngOnInit(): void {
  }

  // Старт гри. Рандомне підсвічення ячейки та таймер
  startGame() {
    if (!this.gameOver) {
      this.randomlyHighlightCell();
      this.timer = setTimeout(() => this.handleTimeout(), this.timerDuration);
    }
  }

  // Якщо гравець натискає
  cellClick(row: number, col: number) {
    // Пошук ячейки в масиві
    const clickedCell = this.cells.find(cell => cell.row === row && cell.col === col);

    // Знайдена ячейка, перевірка классу та чи не закінче гра
    if (clickedCell && clickedCell.state === 'highlighted' && !this.gameOver) {
      // Скидається таймер
      clearTimeout(this.timer);
      // Додається класс, який показує, що гравець натиснув
      clickedCell.state = 'player';
      this.playerScore++;

      // Якщо рахунок = 10 - гра закінчується. Якщо ні - запускається функція startGame
      if (this.playerScore === 10) {
        this.showResults('Гравець');
      } else {
        this.startGame();
      }
    }
  }

  // Рандомна підсвітка ячейки
  private randomlyHighlightCell() {
    // Фільтрація на вже показану ячейку
    const availableCells = this.cells.filter(cell =>
      cell.row !== this.currentHighlightedCell.row || cell.col !== this.currentHighlightedCell.col
    );

    // Якщо ячейка доступна - умова виконується
    if (availableCells.length > 0) {
      // Визначається рандомний індекс
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const highlightedCell = availableCells[randomIndex];

      if (highlightedCell) {
        // Підсвічується ячейка
        highlightedCell.state = 'highlighted';
        // Записується позиція цієї ячейки
        this.currentHighlightedCell = { row: highlightedCell.row, col: highlightedCell.col };
      }
    }
  }

  private handleTimeout() {
    // Пошук підсвіченої ячейки
    const highlightedCell = this.cells.find(cell => cell.state === 'highlighted');
    
    if (highlightedCell) {
      // Позначається, що ячейка за комп'ютером
      highlightedCell.state = 'computer';
      this.computerScore++;

      // Якщо рахунок = 10 - гра закінчується. Якщо ні - запускається функція startGame
      if (this.computerScore === 10) {
        this.showResults('Комп\'ютер');
      } else {
        this.startGame();
      }
    }
  }

  // Функція яка викликає попап, та відмічає, що гра завершена
  private showResults(winner: string) {
    this.gameOver = true;
    this.winner = winner;
  }

  // Фунція перезапуску гри
  restartGame() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.cells.forEach(cell => cell.state = 'normal');
  }

}
