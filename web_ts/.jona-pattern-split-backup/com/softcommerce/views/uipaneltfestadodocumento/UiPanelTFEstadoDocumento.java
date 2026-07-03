/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfestadodocumento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.AbstractRegister;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.EstadoDocumentoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnEstadoDocumento;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.Icon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.BevelBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFEstadoDocumento extends JHInternalFrame implements InterUiPanelTFEstadoDocumento, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public EstadoDocumentoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    private String titleJIF;
    private JLabel lblTitle;
    private AbstractRegister register;
    private Usuario usuario;
    private JLabel lblRegister;
    private JLabel lblRowCount;
    private JTextField txtRow;
    private JButton cbFirst;
    private JButton cbPrevius;
    private JButton cbNext;
    private JButton cbLast;
    private JButton cbAdd;
    private JButton cbModify;
    private JButton cbEliminate;
    private JButton cbDetails;
    private JButton cbSearch;
    private JButton cbPrint;
    private JButton cbPrintFast;
    private JButton cbClose;
    private JButton cbRefresh;
    private JButton cbNullify;
    private JButton cbClone;
    private JButton cbReport;
    private JMenuItem miInsert;
    private JMenuItem miUpdate;
    private JMenuItem miDelete;
    private JMenuItem miDetail;
    private JMenuItem miPrint;
    private JMenuItem miRefresh;

    public UiPanelTFEstadoDocumento(AbstractRegister areg, String title, JFrame frm, Usuario usuario) {
        super(title);
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        titleJIF = title;
        inicialize();
    }

    public UiPanelTFEstadoDocumento(AbstractRegister areg, String title, JFrame frm, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        titleJIF = title;
        inicialize(vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
    }

    private void inicialize() {
        Gif gif = new Gif();

        CardLayout cardView = new CardLayout();
        JPanel pnlCardView = new JPanel(cardView);
        pnlCardView.setBorder(new BevelBorder(1));
        pnlCardView.setOpaque(false);

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        JPanel pnlRow = new JPanel();
        pnlRow.setOpaque(false);
        pnlRow.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlRow.setBackground(new Color(236, 233, 216));
        pnlRow.setBorder(new EmptyBorder(0, 145, 0, 0));

        int a = 25, h = 20;

        lblRegister = new JLabel("Registro: ");
        lblRegister.setOpaque(false);
        pnlRow.add(lblRegister);

        cbFirst = new JButton(gif.FIRST);
        cbFirst.setPreferredSize(new Dimension(a, h));
        cbFirst.setToolTipText("Primer registro");
        cbFirst.addActionListener(this);
        cbFirst.setOpaque(false);
        pnlRow.add(cbFirst);

        cbPrevius = new JButton(gif.PREVIUS);
        cbPrevius.setPreferredSize(new Dimension(a, h));
        cbPrevius.setToolTipText("Registro anterior");
        cbPrevius.addActionListener(this);
        cbPrevius.setOpaque(false);
        pnlRow.add(cbPrevius);

        txtRow = new JTextField();
        txtRow.setPreferredSize(new Dimension(80, h - 2));
        txtRow.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRow.add(txtRow);

        cbNext = new JButton(gif.NEXT);
        cbNext.setPreferredSize(new Dimension(a, h));
        cbNext.setToolTipText("Registro siguiente");
        cbNext.addActionListener(this);
        cbNext.setOpaque(false);
        pnlRow.add(cbNext);

        cbLast = new JButton(gif.LAST);
        cbLast.setPreferredSize(new Dimension(a, h));
        cbLast.setToolTipText("Último registro");
        cbLast.addActionListener(this);
        cbLast.setOpaque(false);
        pnlRow.add(cbLast);

        lblRowCount = new JLabel("de ");
        lblRowCount.setOpaque(false);
        pnlRow.add(lblRowCount);

        pnl.add(pnlRow, BorderLayout.SOUTH);

        JPanel pnlControl = new JPanel();
        pnlControl.setLayout(new BorderLayout());
        pnlControl.setOpaque(false);
        pnlControl.setPreferredSize(new Dimension(150, 0));

        int an = 120, ha = 30, s = 10;

        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbAdd = new JButton("Agregar", gif.ADD16);
        cbAdd.setPreferredSize(new Dimension(an, ha));
        cbAdd.setHorizontalAlignment(SwingConstants.LEFT);
        cbAdd.setMnemonic('A');
        cbAdd.addActionListener(this);
        cbAdd.setOpaque(false);
        cbAdd.setIconTextGap(s);
        pnlNorth.add(cbAdd);

        cbModify = new JButton("Modificar", gif.MODIFY16);
        cbModify.setPreferredSize(new Dimension(an, ha));
        cbModify.setHorizontalAlignment(SwingConstants.LEFT);
        cbModify.setMnemonic('M');
        cbModify.addActionListener(this);
        cbModify.setOpaque(false);
        cbModify.setIconTextGap(s);
        pnlNorth.add(cbModify);

        cbEliminate = new JButton("Eliminar", gif.ELIMINATE16);
        cbEliminate.setPreferredSize(new Dimension(an, ha));
        cbEliminate.setHorizontalAlignment(SwingConstants.LEFT);
        cbEliminate.setMnemonic('E');
        cbEliminate.addActionListener(this);
        cbEliminate.setOpaque(false);
        cbEliminate.setIconTextGap(s);
        pnlNorth.add(cbEliminate);

        cbNullify = new JButton("Anular", gif.NULLIFY);
        cbNullify.setPreferredSize(new Dimension(an, ha));
        cbNullify.setHorizontalAlignment(SwingConstants.LEFT);
        cbNullify.setMnemonic('N');
        cbNullify.addActionListener(this);
        cbNullify.setOpaque(false);
        cbNullify.setIconTextGap(s);
        pnlNorth.add(cbNullify);

        cbClone = new JButton("Clonar", gif.CLONE);
        cbClone.setPreferredSize(new Dimension(an, ha));
        cbClone.setHorizontalAlignment(SwingConstants.LEFT);
        cbClone.setMnemonic('N');
        cbClone.addActionListener(this);
        cbClone.setOpaque(false);
        cbClone.setIconTextGap(s);
        pnlNorth.add(cbClone);

        cbDetails = new JButton("Detalle", gif.DETAIL16);
        cbDetails.setPreferredSize(new Dimension(an, ha));
        cbDetails.setHorizontalAlignment(SwingConstants.LEFT);
        cbDetails.setMnemonic('Z');
        cbDetails.addActionListener(this);
        cbDetails.setOpaque(false);
        cbDetails.setIconTextGap(s);
        pnlNorth.add(cbDetails);

        cbSearch = new JButton("Buscar", gif.SEARCH16);
        cbSearch.setPreferredSize(new Dimension(an, ha));
        cbSearch.setHorizontalAlignment(SwingConstants.LEFT);
        cbSearch.setMnemonic('B');
        cbSearch.addActionListener(this);
        cbSearch.setOpaque(false);
        cbSearch.setIconTextGap(s);
        pnlNorth.add(cbSearch);

        cbReport = new JButton("Reporte", gif.REPORT16);
        cbReport.setPreferredSize(new Dimension(an, ha));
        cbReport.setHorizontalAlignment(SwingConstants.LEFT);
        cbReport.setMnemonic('R');
        cbReport.addActionListener(this);
        cbReport.setOpaque(false);
        cbReport.setIconTextGap(s);
        pnlNorth.add(cbReport);

        cbPrint = new JButton("Imprimir", gif.PRINT16);
        cbPrint.setPreferredSize(new Dimension(an, ha));
        cbPrint.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrint.setMnemonic('I');
        cbPrint.addActionListener(this);
        cbPrint.setOpaque(false);
        cbPrint.setIconTextGap(s);
        pnlNorth.add(cbPrint);

        cbPrintFast = new JButton("Imp. Directa", gif.PRINT16);
        cbPrintFast.setPreferredSize(new Dimension(an, ha));
        cbPrintFast.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrintFast.setMnemonic('F');
        cbPrintFast.addActionListener(this);
        cbPrintFast.setOpaque(false);
        cbPrintFast.setIconTextGap(s);
        pnlNorth.add(cbPrintFast);

        cbClose = new JButton("Cerrar", gif.EXIT16);
        cbClose.setPreferredSize(new Dimension(an, ha));
        cbClose.setHorizontalAlignment(SwingConstants.LEFT);
        cbClose.setMnemonic('S');
        cbClose.addActionListener(this);
        cbClose.setOpaque(false);
        cbClose.setIconTextGap(s);
        pnlNorth.add(cbClose);

        pnlControl.add(pnlNorth, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbRefresh = new JButton("Refrescar", gif.REFRESH16);
        cbRefresh.setPreferredSize(new Dimension(an, ha));
        cbRefresh.setHorizontalAlignment(SwingConstants.LEFT);
        cbRefresh.setMnemonic('R');
        cbRefresh.addActionListener(this);
        cbRefresh.setOpaque(false);
        cbRefresh.setIconTextGap(s);
        pnlSouth.add(cbRefresh);

        pnlControl.add(pnlSouth, BorderLayout.SOUTH);

        pnl.add(pnlControl, BorderLayout.WEST);

        JPanel pnlaux = new JPanel(new BorderLayout());
        pnlaux.setLayout(new BorderLayout(0, 0));

        modeltable = new EstadoDocumentoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        scroll = new JScrollPane(table);

        JPopupMenu popupView = new JPopupMenu();

        miInsert = new JMenuItem("Agregar", gif.ADD16);
        miInsert.addActionListener(this);
        popupView.add(miInsert);

        miUpdate = new JMenuItem("Modificar", gif.MODIFY16);
        miUpdate.addActionListener(this);
        popupView.add(miUpdate);

        miDelete = new JMenuItem("Eliminar", gif.ELIMINATE16);
        miDelete.addActionListener(this);
        popupView.add(miDelete);

        miDetail = new JMenuItem("Detalle", gif.DETAIL16);
        miDetail.addActionListener(this);
        popupView.add(miDetail);

        miPrint = new JMenuItem("Imprimir", gif.PRINT16);
        miPrint.addActionListener(this);
        popupView.add(miPrint);

        popupView.addSeparator();

        miRefresh = new JMenuItem("Refrescar", gif.REFRESH16);
        miRefresh.addActionListener(this);
        popupView.add(miRefresh);

        table.setComponentPopupMenu(popupView);
        table.getSelectionModel().addListSelectionListener(this);
        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        scroll = new JScrollPane(table);

        pnlaux.add(scroll, BorderLayout.CENTER);
        pnl.add(pnlaux, BorderLayout.CENTER);

        lblTitle = new JLabel();
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(214, 223, 245));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        pnlCardView.add("pnlPrincipal", pnl);
        setPanel(pnlCardView);
    }

    private void inicialize(boolean swAdd, boolean swModify, boolean swEliminate, boolean swNullify, boolean swClone, boolean swDetails, boolean swSearch, boolean swReport, boolean swExport, boolean swPrint, boolean swPrintFast, boolean swClose, boolean swRefresh) {
        Gif gif = new Gif();

        CardLayout cardView = new CardLayout();
        JPanel pnlCardView = new JPanel(cardView);
        pnlCardView.setBorder(new BevelBorder(1));
        pnlCardView.setOpaque(false);

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        JPanel pnlRow = new JPanel();
        pnlRow.setOpaque(false);
        pnlRow.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlRow.setBackground(new Color(236, 233, 216));
        pnlRow.setBorder(new EmptyBorder(0, 145, 0, 0));

        int a = 25, h = 20;

        lblRegister = new JLabel("Registro: ");
        lblRegister.setOpaque(false);
        pnlRow.add(lblRegister);

        cbFirst = new JButton(gif.FIRST);
        cbFirst.setPreferredSize(new Dimension(a, h));
        cbFirst.setToolTipText("Primer registro");
        cbFirst.addActionListener(this);
        cbFirst.setOpaque(false);
        pnlRow.add(cbFirst);

        cbPrevius = new JButton(gif.PREVIUS);
        cbPrevius.setPreferredSize(new Dimension(a, h));
        cbPrevius.setToolTipText("Registro anterior");
        cbPrevius.addActionListener(this);
        cbPrevius.setOpaque(false);
        pnlRow.add(cbPrevius);

        txtRow = new JTextField();
        txtRow.setPreferredSize(new Dimension(80, h - 2));
        txtRow.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRow.add(txtRow);

        cbNext = new JButton(gif.NEXT);
        cbNext.setPreferredSize(new Dimension(a, h));
        cbNext.setToolTipText("Registro siguiente");
        cbNext.addActionListener(this);
        cbNext.setOpaque(false);
        pnlRow.add(cbNext);

        cbLast = new JButton(gif.LAST);
        cbLast.setPreferredSize(new Dimension(a, h));
        cbLast.setToolTipText("Último registro");
        cbLast.addActionListener(this);
        cbLast.setOpaque(false);
        pnlRow.add(cbLast);

        lblRowCount = new JLabel("de ");
        lblRowCount.setOpaque(false);
        pnlRow.add(lblRowCount);

        pnl.add(pnlRow, BorderLayout.SOUTH);

        JPanel pnlControl = new JPanel();
        pnlControl.setLayout(new BorderLayout());
        pnlControl.setOpaque(false);
        pnlControl.setPreferredSize(new Dimension(150, 0));

        int an = 120, ha = 30, s = 10;

        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbAdd = new JButton("Agregar", gif.ADD16);
        cbAdd.setPreferredSize(new Dimension(an, ha));
        cbAdd.setHorizontalAlignment(SwingConstants.LEFT);
        cbAdd.setMnemonic('A');
        cbAdd.addActionListener(this);
        cbAdd.setOpaque(false);
        cbAdd.setIconTextGap(s);
        if (swAdd) {
            pnlNorth.add(cbAdd);
        }

        cbModify = new JButton("Modificar", gif.MODIFY16);
        cbModify.setPreferredSize(new Dimension(an, ha));
        cbModify.setHorizontalAlignment(SwingConstants.LEFT);
        cbModify.setMnemonic('M');
        cbModify.addActionListener(this);
        cbModify.setOpaque(false);
        cbModify.setIconTextGap(s);
        if (swModify) {
            pnlNorth.add(cbModify);
        }

        cbEliminate = new JButton("Eliminar", gif.ELIMINATE16);
        cbEliminate.setPreferredSize(new Dimension(an, ha));
        cbEliminate.setHorizontalAlignment(SwingConstants.LEFT);
        cbEliminate.setMnemonic('E');
        cbEliminate.addActionListener(this);
        cbEliminate.setOpaque(false);
        cbEliminate.setIconTextGap(s);
        if (swEliminate) {
            pnlNorth.add(cbEliminate);
        }

        cbNullify = new JButton("Anular", gif.NULLIFY);
        cbNullify.setPreferredSize(new Dimension(an, ha));
        cbNullify.setHorizontalAlignment(SwingConstants.LEFT);
        cbNullify.setMnemonic('N');
        cbNullify.addActionListener(this);
        cbNullify.setOpaque(false);
        cbNullify.setIconTextGap(s);
        if (swNullify) {
            pnlNorth.add(cbNullify);
        }

        cbClone = new JButton("Clonar", gif.CLONE);
        cbClone.setPreferredSize(new Dimension(an, ha));
        cbClone.setHorizontalAlignment(SwingConstants.LEFT);
        cbClone.setMnemonic('N');
        cbClone.addActionListener(this);
        cbClone.setOpaque(false);
        cbClone.setIconTextGap(s);
        if (swClone) {
            pnlNorth.add(cbClone);
        }

        cbDetails = new JButton("Detalle", gif.DETAIL16);
        cbDetails.setPreferredSize(new Dimension(an, ha));
        cbDetails.setHorizontalAlignment(SwingConstants.LEFT);
        cbDetails.setMnemonic('Z');
        cbDetails.addActionListener(this);
        cbDetails.setOpaque(false);
        cbDetails.setIconTextGap(s);
        if (swDetails) {
            pnlNorth.add(cbDetails);
        }

        cbSearch = new JButton("Buscar", gif.SEARCH16);
        cbSearch.setPreferredSize(new Dimension(an, ha));
        cbSearch.setHorizontalAlignment(SwingConstants.LEFT);
        cbSearch.setMnemonic('B');
        cbSearch.addActionListener(this);
        cbSearch.setOpaque(false);
        cbSearch.setIconTextGap(s);
        if (swSearch) {
            pnlNorth.add(cbSearch);
        }

        cbReport = new JButton("Reporte", gif.REPORT16);
        cbReport.setPreferredSize(new Dimension(an, ha));
        cbReport.setHorizontalAlignment(SwingConstants.LEFT);
        cbReport.setMnemonic('R');
        cbReport.addActionListener(this);
        cbReport.setOpaque(false);
        cbReport.setIconTextGap(s);
        if (swReport) {
            pnlNorth.add(cbReport);
        }

        cbPrint = new JButton("Imprimir", gif.PRINT16);
        cbPrint.setPreferredSize(new Dimension(an, ha));
        cbPrint.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrint.setMnemonic('I');
        cbPrint.addActionListener(this);
        cbPrint.setOpaque(false);
        cbPrint.setIconTextGap(s);
        if (swPrint) {
            pnlNorth.add(cbPrint);
        }

        cbPrintFast = new JButton("Imp. Directa", gif.PRINT16);
        cbPrintFast.setPreferredSize(new Dimension(an, ha));
        cbPrintFast.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrintFast.setMnemonic('F');
        cbPrintFast.addActionListener(this);
        cbPrintFast.setOpaque(false);
        cbPrintFast.setIconTextGap(s);
        if (swPrintFast) {
            pnlNorth.add(cbPrintFast);
        }

        cbClose = new JButton("Cerrar", gif.EXIT16);
        cbClose.setPreferredSize(new Dimension(an, ha));
        cbClose.setHorizontalAlignment(SwingConstants.LEFT);
        cbClose.setMnemonic('S');
        cbClose.addActionListener(this);
        cbClose.setOpaque(false);
        cbClose.setIconTextGap(s);
        if (swClose) {
            pnlNorth.add(cbClose);
        }

        pnlControl.add(pnlNorth, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbRefresh = new JButton("Refrescar", gif.REFRESH16);
        cbRefresh.setPreferredSize(new Dimension(an, ha));
        cbRefresh.setHorizontalAlignment(SwingConstants.LEFT);
        cbRefresh.setMnemonic('R');
        cbRefresh.addActionListener(this);
        cbRefresh.setOpaque(false);
        cbRefresh.setIconTextGap(s);
        if (swRefresh) {
            pnlSouth.add(cbRefresh);
        }

        pnlControl.add(pnlSouth, BorderLayout.SOUTH);

        pnl.add(pnlControl, BorderLayout.WEST);

        JPanel pnlaux = new JPanel(new BorderLayout());
        pnlaux.setLayout(new BorderLayout(0, 0));

        modeltable = new EstadoDocumentoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        scroll = new JScrollPane(table);

        JPopupMenu popupView = new JPopupMenu();

        miInsert = new JMenuItem("Agregar", gif.ADD16);
        miInsert.addActionListener(this);
        popupView.add(miInsert);

        miUpdate = new JMenuItem("Modificar", gif.MODIFY16);
        miUpdate.addActionListener(this);
        popupView.add(miUpdate);

        miDelete = new JMenuItem("Eliminar", gif.ELIMINATE16);
        miDelete.addActionListener(this);
        popupView.add(miDelete);

        miDetail = new JMenuItem("Detalle", gif.DETAIL16);
        miDetail.addActionListener(this);
        popupView.add(miDetail);

        miPrint = new JMenuItem("Imprimir", gif.PRINT16);
        miPrint.addActionListener(this);
        popupView.add(miPrint);

        popupView.addSeparator();

        miRefresh = new JMenuItem("Refrescar", gif.REFRESH16);
        miRefresh.addActionListener(this);
        popupView.add(miRefresh);

        table.setComponentPopupMenu(popupView);
        table.getSelectionModel().addListSelectionListener(this);
        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        scroll = new JScrollPane(table);

        pnlaux.add(scroll, BorderLayout.CENTER);
        pnl.add(pnlaux, BorderLayout.CENTER);

        lblTitle = new JLabel();
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(214, 223, 245));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        pnlCardView.add("pnlPrincipal", pnl);
        setPanel(pnlCardView);
    }

    public void setTitle(String title, Icon icon) {
        lblTitle.setText(" " + title);
        lblTitle.setIcon(icon);
    }

    public void cargarFiltro() {
    }

    public void cargarTabla() {
        RnEstadoDocumento regla = new RnEstadoDocumento(path);
        modeltable.clearTable();
        modeltable.agregarVectorestadodoc(regla.listarGeneral());
        table.setAllColumnPreferredWidth();
        refresh();
    }

    public void refresh() {
    }

    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
    }

    public void controlPrint(boolean view) {
    }

    public void refreshTitleName() {
    }

    public void valueChanged(ListSelectionEvent e) {
    }

    public void selectFirstRow() {
    }

    public void selectPreviusRow() {
    }

    public void selectNextRow() {
    }

    public void selectLastRow() {
    }

    public int getSelectedRow() {
        return -1;
    }

    public int getRowCount() {
        return -1;
    }

    public void setSelectedRow(int row) {
    }

    public void setSelectedRow(String clave, int column) {
    }

    public Object getSelectedValue(String column) {
        return null;
    }

    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Estado Documento");
        ExportExcel.exportar(table, parameters);
    }

    public void controlAdd() {
        if (register != null) {
            register.setPath(path);
            register.setModeRegister(Register.INSERT);
            register.showRegister();
        }
    }

    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.UPDATE)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.DELETE)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.DETAIL)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }

    }

    public void controlSearch() {
    }

    public void controlClose() {
        setVisible(false);
        dispose();
        doDefaultCloseAction();
    }

    public void controlRefresh() {
        cargarTabla();
    }

    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.ANULAR)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            register.setModeRegister(Register.CLONE);
            register.showRegister();
        }
    }

    public void windowOpened(WindowEvent e) {
    }

    public void windowClosing(WindowEvent e) {
    }

    public void windowClosed(WindowEvent e) {
    }

    public void windowIconified(WindowEvent e) {
    }

    public void windowDeiconified(WindowEvent e) {
    }

    public void windowActivated(WindowEvent e) {
    }

    public void windowDeactivated(WindowEvent e) {
    }

    public void focusGained(FocusEvent e) {
    }

    public void focusLost(FocusEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyPressed(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public void actionPerformed(ActionEvent e) {
        if (cbFirst == e.getSource()) {
            selectFirstRow();
        }

        if (cbPrevius == e.getSource()) {
            selectPreviusRow();
        }

        if (cbNext == e.getSource()) {
            selectNextRow();
        }

        if (cbLast == e.getSource()) {
            selectLastRow();
        }

        if (cbAdd == e.getSource()) {
            controlAdd();
        }

        if (cbModify == e.getSource()) {
            controlModify();
        }

        if (cbEliminate == e.getSource()) {
            controlEliminate();
        }

        if (cbDetails == e.getSource()) {
            controlDetails();
        }

        if (cbSearch == e.getSource()) {
            controlSearch();
        }

        if (cbPrint == e.getSource()) {
            controlPrint(true);
        }

        if (cbClose == e.getSource()) {
            controlClose();
        }

        if (cbRefresh == e.getSource()) {
            controlRefresh();
        }

        if (cbPrintFast == e.getSource()) {
            controlPrint(false);
        }

        if (cbNullify == e.getSource()) {
            controlNullify();
        }

        if (cbClone == e.getSource()) {
            controlClone();
        }

        if (cbReport == e.getSource()) {
            controlReport(false);
        }

        if (e.getSource() == miInsert) {
            controlAdd();
        }

        if (e.getSource() == miUpdate) {
            controlModify();
        }

        if (e.getSource() == miDelete) {
            controlEliminate();
        }

        if (e.getSource() == miDetail) {
            controlDetails();
        }

        if (e.getSource() == miPrint) {
            controlPrint(true);
        }

        if (e.getSource() == miRefresh) {
            controlRefresh();
        }
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    public void selectFirstPage() {
    }

    public void selectPreviusPage() {
    }

    public void selectNextPage() {
    }

    public void selectLastPage() {
    }

    public int getSelectedPage() {
        return 0;
    }

    public int getPageCount() {
        return 0;
    }
}
